# How we built TextArena

Neither of us (Bobby and Leon) had any frontend or backend experience (and SWE experience for that matter) before building TextArena. The repo and pip package were no problem, as we are comfortable with python etc., but how to implement the backend and frontend generally left us with a big question mark. Fortunately, we ended up making it work; aquiring a lot of learnings along the way. 

As research is shifting towards interactive agents and evals, we thought it would be valuable to share these learnings with other researchers so you don't have to suffer through the same process. As part of this, we are also open-sourcing both the backend and the frontend code (under the MIT license so by all means please feel free to copy any (or all) of it). 

This blog post will walk you through the process of how we created the different verions of TextArena, the tools used for each version and what the learnings were.


## Table of Contents
1. [Version 1: Early release](#version-1-early-release)
2. [Version 2: Sleepless fixes](#version-2-sleepless-fixes)
3. [Version 3: Good enough](#version-3-good-enough)



## Version 1: Early release
We finished the inital version of the pip package in early January. We originally considered creating the leaderboard etc. on a monthly basis where researchers can send us their models and we run a tornament offline. However, the shortcomings of that quickly became clear. It would be too expensive, too cumbersome, and too slow (for the researchers to see their scores). Thus we decided to try and build an online evaluation (that would also allow humans to participate). 

The pip package allows users to `.make(...)` environments offline for playing. For example
```python3
import textarena as ta

# Initialize agents
agents = {
    0: ta.agents.OpenRouterAgent(model_name="GPT-4o-mini"),
    1: ta.agents.OpenRouterAgent(model_name="anthropic/claude-3.5-haiku"),
}

# Initialize the environment
env = ta.make(env_id="TicTacToe-v0")
env.reset(num_players=len(agents))

done = False
while not done:
    player_id, observation = env.get_observation()
    action = agents[player_id](observation)
    done, step_info = env.step(action=action)

rewards, game_info = env.close()
```

The goal was to keep the structure for online evaluation as close as possible to this (optimally only having to replace `.make` with `.make_online`). The first big design question was how the clients would communicate with our server. __This is perhaps a good time to once again mention that we don't have any SWE experience, so if the nomenclature is wrong, our apologies.__ Since websockets seemed harder to use than simple api calls (I mean how many `async` decorators does one need, jesus), we went with that. Early on it was already clear that none of this will be very scaleable, but our thinking was that once we run into scalability issues, we can just re-write the backend, and if anything, hitting those scaleability limits would be a good thing.

Not to go into an unnecessary amount of detail (if you are keen, I believe the first version used was [this](https://github.com/LeonGuertler/TextArena/blob/8061407d900b120eaadd2b4c4fbb6f991ad4c7c9/textarena/api/api_client.py)), the general setup was the "user" would have to register their model first by calling:
```python3
model_token = ta.register_online_model(
    model_name="GPT-4o-mini",
    model_description="OpenAI's GPT-4o-mini model.",
    email="your.email@example.com"
)
```

and then use the `model_token` in `.make_online` like this:

```python3
env = ta.make_online(
    env_id="BalancedSubset-v0",
    model_name="GPT-4o-mini",
    model_token=model_token
)
env = ta.wrappers.LLMObservationWrapper(env=env)
env.reset()
done = False
while not done:
    player_id, observation = env.get_observation()
    action = agent(observation)
    done, info = env.step(action=action)
rewards = env.close()
```

The inital `.register_online_model` call would call a simple api endpoint on the backend that will do some basic checks on the information (i.e. whether the model already exists etc.), add the user to our **Supabase** database (using Supabase for the get-go was one of the things we got right (and was a recommendation by Henry Mao)). 

Subsequently, the `.make_online` call will call the backend to add the user to the matchmaking queue. The next part highlights the downside of using api calls rather than websockets well; the client will query ther server every __n__ seconds to check whether the user has found a match. Once a match has been found, the client will query the server every __n__ seconds to check whether it is the users turn, and if so (this server response will already contain the observation), generate an action and send it to the server. 


Whilst not being very scalable, this worked (albeit with some annoying delays becuase of the __n__ second waits). Next up we started building the frontend. Using **Vercel** was another great recommendatin by Henry. We initially didn't know about **v0** (more about that later), but it seemed easy enough to pick one of their templates, make the changes we needed to make and run it. Neither of us knew (or know now) any frontend langauges, so GPT and Claude (esp. claude) were extremely helpful in making those changes. The website we in hindsight not exactly a thing of beauty (see below) but worked.

[TODO add website images here]


We had both a functional leaderboard and the human play component. However, any db queary was running via our single backend server (as did the play), so this was not scalable and as the db grew larger the website loading speed would decrease. To make matters worse, we were running the backend on one of Leon's machines in Germany (which he accessed using ngrok...). 

We finished building all of this on Friday the 31st of January. Conincidentally, the previous day Andrej Karpathy tweeted the following:

![Karpathy Tweet](/public/karparthy-tweet-initial.png)

Which in fact was perfect timing, and we were keen to get some feedback from the community, so Leon commented on the tweet and went to bed.

![Leon's Reply](/public/leon-reply.png)

Leon remembered waking up at around 5am or so to pee, and checking his phone to a perplexing amount of notifications. To his surprise, Andrej had seen the comment and was kind enough to highlight our work:

![Karpathy's Reply](/public/karparthy-reply.png)

Naturally everything broke instantly (after all we thought enough usage to break the system was a good problem to have). Surprisingly the main issues was not the api-based communication or the monolith back-end server (which also doubled as the game server), but rather ngrok..... 

It was clear we had to re-built, and not only fast but also in a scalable manner.


## Version 2: Sleepless Fixes
This brings us to version 2, which we built in around 1 week of 18-20h work days. We realized, the repeated client side api calls to check whether it is the players turn etc. are not scalable and we would have to replace them with websockets and that we should ensure the monolith back-end is not the single point of failure for the system. Thus we started re-writing the frontend, back-end and python package.

This is obvioulsy not an ad, but using **v0** by vercel was such a life saver. Easy to use (even for somebody with 0 frontend experience) and just via prompting it we were able to build maybe 70% of the website. This is also where we implemented the first major fix by allowing the frontend to talk with the database without having to use the monolith back-end server. This was mostly necessary for the leaderboard (perhaps the most important component).

Secondly we updated the backend and package to work with websockets. **AWS** was kind enough to sponsor TextArena with enough credits to rent a decent backend server for a year (solving the ngrok problem as well) and **OpenRouter** sponsored credits so we don't have to pay for the models hosted out of pocket. We were able to switch everything over to websockets, but not being very familiar with server architectures etc. still opted for a single big server responsible for everything from signing up new models, to matchmaking and game-play. This worked well (and scaled decently well), but we still had some problems; namely some random disconnects of humans and models when the load was too high. We were not and still are not sure why this happened. This led us to the next big version update.


## Version 3: Good Enough

Whilst iteratively refining the frontend, we managed to port the backend over to a serverless structure on AWS. This was amidst a period where we were rather foolishly ambitious because we simultaneously went on to build VideoGameArena for Mortal Kombat, Super Mario and Zelda.

![videogamearena](/public/videogamearena.png)

Not a bad thing actually. The specific nature of VideoGameArena required an Ubuntu-based environment and precise Python library versions, so we had no choice but to build it serverless. And although VideoGameArena is something we've put on hold, our early experimentations gave us a better intuition of what serverless is and how to (or at least try to) design one properly for TextArena.

So, if we’re not wrong, serverless refers to an architecture where we don’t manage long-lived servers ourselves. Instead, with AWS, we containerize the part of our code that handles game logic and match state (what we now call the game server) using Docker, push it to Amazon ECR, and rely on AWS Fargate to spin up a fresh instance for each match on demand. Once a match ends, the container shuts down automatically. This should give us a clean isolation between games (overcoming version 2's random disconnects), auto-scaling, and usage-based cost.

So, we began by decoupling the monolith back-end server into (1) a game server that will host individual game matches (TextArenaServerless), and (2) a matchmaking server (TextArenaMatchmakingServer). 

One learning from the matchmaking server design is that we initially designed it with AWS Lambda. However, Lambda’s stateless nature made it difficult to maintain real-time matchmaking logic and track players in queue. Worse, our cost estimates showed that the volume of daily calls would exceed a dedicated EC2 instance. Given these trade-offs, we decided to host our matchmaking server on an EC2 instance running FastAPI.

To match players, we opt for a probabilistic scoring system that increases as players wait longer in the queue and as their TrueSkill levels converge using the `calculate_match_probability()`. For multiplayer games, we also factor in the group size required (`calculate_multiplayer_match_probability()`). Additionally, we apply a penalty factor when both players are standard and non-human models (aka, models from official AI labs) to encourage more diverse matchups and prioritize humans or user-submitted models in matches. We find that this probability-based approach ensures fairness and responsiveness for players. You can find both functions in the `TextArenaMatchmakingServer` repo.

Then, when a match is found, the TextArenaMatchmakingServer will select a pre-initialized ECS Fargate task from a server pool. Each Fargate task will run a single game instance with TextArenaServerless and is dynamically registered with an Application Load Balancer (ALB) using the `register_fargate_task_to_alb()`. This is where a unique target group is created per game, with the task's private IP registered to it, and a path-based listener rule (e.g., /game/<game_id>*) is added to route traffic to the correct task; allowing the players of that match to connect via a stable WebSocket URL like wss://gamehost.textarena.ai/game/<game_id>.

Finally, the matchmaking server then sends the game URL to each client, who disconnects from TextArenaMatchmakingServer and connects directly to the assigned TextArenaServerless. Once the game concludes, the game server cleans itself up by removing its ALB routing rule, updating results to Supabase, and shutting down the ECS task. 

```bash
[WebSocket Connect to Matchmaking] 
    → [Send 'queue' Command] 
    → [Matchmaking Loop Forms Match] 
    → [Select or Start ECS Fargate Task] 
    → [Generate game_id] 
    → [Register Target Group & ALB Route (/game/<game_id>* → Task IP)] 
    → [POST /initialize to Game Server] 
    → [Send game_url (wss://gamehost.textarena.ai/game/<game_id>) to Clients] 
    → [Clients Disconnect from Matchmaking] 
    → [Clients Connect to Game Server WebSocket] 
    → [Game Runs in Isolated ECS Task] 
    → [Send Results to Supabase & Deregister ALB Route] 
    → [Terminate ECS Task]
```

Version 3 has been the ...

TODO add how the pip package changed and how to play online now.


# TLDR;
If you ever build a research demo, we strongly recommend using **v0** by vercel for the frontend, **Supabase** as your database (works great with vercel) and **AWS** to build your backend (if you do have interactive features, making it serverless from the get-go makes a lot of sense). The biggest takeaway by far from all of this all of this is much much easier than it seems. We were originally worried that a websocket based architecture, or a serverless one would be too complicated to build, it's not!

Also, if we had to do it again, starting with a very simple first version is still the way to go. Your website crashing because it got too popular is a good thing, and if you are willing to spend a sleepless week fixing everything, it is good enough!

Since we didn't have anybody we could ask questions about any of this, if you are building a research demo, and have any specific questions about how to build something or just want feedback, please feel very free to ask us on discord or email either of us (guertlero@cfar.a-star.edu.sg; chengxy@i2r.a-star.edu.sg).


# Open Source
As promised, here are the links to all three codebases. They are not necessarily well commented and there is no documentation at all (at some point we aim to add both).

- The TextArena python package: https://github.com/LeonGuertler/TextArena
- The TextArena Frontend: https://github.com/LeonGuertler/TextArena-website
- The TextArena Matchmaking server: TODO
- The TextAren Serverless code: TODO

Also by all means, if you are keen please feel free to contribute to any of these four.