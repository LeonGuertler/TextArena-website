// // import type { Config } from "tailwindcss";

// // const config: Config = {
// //     darkMode: ["class"],
// //     content: [
// //     "./pages/**/*.{js,ts,jsx,tsx,mdx}",
// //     "./components/**/*.{js,ts,jsx,tsx,mdx}",
// //     "./app/**/*.{js,ts,jsx,tsx,mdx}",
// //     "*.{js,ts,jsx,tsx,mdx}"
// //   ],
// //   theme: {
// //   	extend: {
// //   		colors: {
// //   			background: 'hsl(var(--background))',
// //   			foreground: 'hsl(var(--foreground))',
// //   			card: {
// //   				DEFAULT: 'hsl(var(--card))',
// //   				foreground: 'hsl(var(--card-foreground))'
// //   			},
// //   			popover: {
// //   				DEFAULT: 'hsl(var(--popover))',
// //   				foreground: 'hsl(var(--popover-foreground))'
// //   			},
// //   			primary: {
// //   				DEFAULT: 'hsl(var(--primary))',
// //   				foreground: 'hsl(var(--primary-foreground))'
// //   			},
// //   			secondary: {
// //   				DEFAULT: 'hsl(var(--secondary))',
// //   				foreground: 'hsl(var(--secondary-foreground))'
// //   			},
// //   			muted: {
// //   				DEFAULT: 'hsl(var(--muted))',
// //   				foreground: 'hsl(var(--muted-foreground))'
// //   			},
// //   			accent: {
// //   				DEFAULT: 'hsl(var(--accent))',
// //   				foreground: 'hsl(var(--accent-foreground))'
// //   			},
// //   			destructive: {
// //   				DEFAULT: 'hsl(var(--destructive))',
// //   				foreground: 'hsl(var(--destructive-foreground))'
// //   			},
// //   			border: 'hsl(var(--border))',
// //   			input: 'hsl(var(--input))',
// //   			ring: 'hsl(var(--ring))',
// //   			chart: {
// //   				'1': 'hsl(var(--chart-1))',
// //   				'2': 'hsl(var(--chart-2))',
// //   				'3': 'hsl(var(--chart-3))',
// //   				'4': 'hsl(var(--chart-4))',
// //   				'5': 'hsl(var(--chart-5))'
// //   			},
// //   			sidebar: {
// //   				DEFAULT: 'hsl(var(--sidebar-background))',
// //   				foreground: 'hsl(var(--sidebar-foreground))',
// //   				primary: 'hsl(var(--sidebar-primary))',
// //   				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
// //   				accent: 'hsl(var(--sidebar-accent))',
// //   				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
// //   				border: 'hsl(var(--sidebar-border))',
// //   				ring: 'hsl(var(--sidebar-ring))'
// //   			}
// //   		},
// //   		borderRadius: {
// //   			lg: 'var(--radius)',
// //   			md: 'calc(var(--radius) - 2px)',
// //   			sm: 'calc(var(--radius) - 4px)'
// //   		},
// //   		keyframes: {
// //   			'accordion-down': {
// //   				from: {
// //   					height: '0'
// //   				},
// //   				to: {
// //   					height: 'var(--radix-accordion-content-height)'
// //   				}
// //   			},
// //   			'accordion-up': {
// //   				from: {
// //   					height: 'var(--radix-accordion-content-height)'
// //   				},
// //   				to: {
// //   					height: '0'
// //   				}
// //   			}
// //   		},
// //   		animation: {
// //   			'accordion-down': 'accordion-down 0.2s ease-out',
// //   			'accordion-up': 'accordion-up 0.2s ease-out'
// //   		}
// //   	}
// //   },
// //   plugins: [require("tailwindcss-animate")],
// // };
// // export default config;

// /** @type {import('tailwindcss').Config} */
// module.exports = {
// 	darkMode: ["class"],
// 	content: [
// 	  './pages/**/*.{ts,tsx}',
// 	  './components/**/*.{ts,tsx}',
// 	  './app/**/*.{ts,tsx}',
// 	  './src/**/*.{ts,tsx}',
// 	  ],
// 	theme: {
// 	  container: {
// 		center: true,
// 		padding: "2rem",
// 		screens: {
// 		  "2xl": "1400px",
// 		},
// 	  },
// 	  extend: {
// 		fontFamily: {
// 		  sans: ['var(--font-sans)'],
// 		  mono: ['var(--font-mono)'],
// 		},
// 		colors: {
// 		  // colors have same name as in globals.css, but are camelCase here
// 		  navbar: 'hsl(var(--navbar))',
// 		  navbarForeground: 'hsl(var(--navbar-foreground))',
// 		  background: 'hsl(var(--background))',
// 		  foreground: 'hsl(var(--foreground))',
// 		  card: 'hsl(var(--card))',
// 		  cardForeground: 'hsl(var(--card-foreground))',
// 		  popover: 'hsl(var(--popover))',
// 		  popoverForeground: 'hsl(var(--popover-foreground))',
// 		  primary: 'hsl(var(--primary))',
// 		  primaryForeground: 'hsl(var(--primary-foreground))',
// 		  secondary: 'hsl(var(--secondary))',
// 		  secondaryForeground: 'hsl(var(--secondary-foreground))',
// 		  muted: 'hsl(var(--muted))',
// 		  mutedForeground: 'hsl(var(--muted-foreground))',
// 		  accent: 'hsl(var(--accent))',
// 		  accentForeground: 'hsl(var(--accent-foreground))',
// 		  destructive: 'hsl(var(--destructive))',
// 		  destructiveForeground: 'hsl(var(--destructive-foreground))',
// 		  border: 'hsl(var(--border))',
// 		  input: 'hsl(var(--input))',
// 		  ring: 'hsl(var(--ring))',
// 		  chart1: 'hsl(var(--chart-1))',
// 		  chart2: 'hsl(var(--chart-2))',
// 		  chart3: 'hsl(var(--chart-3))',
// 		  chart4: 'hsl(var(--chart-4))',
// 		  chart5: 'hsl(var(--chart-5))',
// 		  sidebarBackground: 'hsl(var(--sidebar-background))',
// 		  sidebarForeground: 'hsl(var(--sidebar-foreground))',
// 		  sidebarPrimary: 'hsl(var(--sidebar-primary))',
// 		  sidebarPrimaryForeground: 'hsl(var(--sidebar-primary-foreground))',
// 		  sidebarAccent: 'hsl(var(--sidebar-accent))',
// 		  sidebarAccentForeground: 'hsl(var(--sidebar-accent-foreground))',
// 		  sidebarBorder: 'hsl(var(--sidebar-border))',
// 		  sidebarRing: 'hsl(var(--sidebar-ring))',
// 		},
// 		borderRadius: {
// 		  lg: "var(--radius)",
// 		  md: "calc(var(--radius) - 2px)",
// 		  sm: "calc(var(--radius) - 4px)",
// 		},
// 		keyframes: {
// 		  "accordion-down": {
// 			from: { height: 0 },
// 			to: { height: "var(--radix-accordion-content-height)" },
// 		  },
// 		  "accordion-up": {
// 			from: { height: "var(--radix-accordion-content-height)" },
// 			to: { height: 0 },
// 		  },
// 		},
// 		animation: {
// 		  "accordion-down": "accordion-down 0.2s ease-out",
// 		  "accordion-up": "accordion-up 0.2s ease-out",
// 		},
// 	  },
// 	},
// 	plugins: [require("tailwindcss-animate")],
//   }

// // import type { Config } from "tailwindcss";

// // const config: Config = {
// //     darkMode: ["class"],
// //     content: [
// //     "./pages/**/*.{js,ts,jsx,tsx,mdx}",
// //     "./components/**/*.{js,ts,jsx,tsx,mdx}",
// //     "./app/**/*.{js,ts,jsx,tsx,mdx}",
// //     "*.{js,ts,jsx,tsx,mdx}"
// //   ],
// //   theme: {
// //   	extend: {
// //   		colors: {
// //   			background: 'hsl(var(--background))',
// //   			foreground: 'hsl(var(--foreground))',
// //   			card: {
// //   				DEFAULT: 'hsl(var(--card))',
// //   				foreground: 'hsl(var(--card-foreground))'
// //   			},
// //   			popover: {
// //   				DEFAULT: 'hsl(var(--popover))',
// //   				foreground: 'hsl(var(--popover-foreground))'
// //   			},
// //   			primary: {
// //   				DEFAULT: 'hsl(var(--primary))',
// //   				foreground: 'hsl(var(--primary-foreground))'
// //   			},
// //   			secondary: {
// //   				DEFAULT: 'hsl(var(--secondary))',
// //   				foreground: 'hsl(var(--secondary-foreground))'
// //   			},
// //   			muted: {
// //   				DEFAULT: 'hsl(var(--muted))',
// //   				foreground: 'hsl(var(--muted-foreground))'
// //   			},
// //   			accent: {
// //   				DEFAULT: 'hsl(var(--accent))',
// //   				foreground: 'hsl(var(--accent-foreground))'
// //   			},
// //   			destructive: {
// //   				DEFAULT: 'hsl(var(--destructive))',
// //   				foreground: 'hsl(var(--destructive-foreground))'
// //   			},
// //   			border: 'hsl(var(--border))',
// //   			input: 'hsl(var(--input))',
// //   			ring: 'hsl(var(--ring))',
// //   			chart: {
// //   				'1': 'hsl(var(--chart-1))',
// //   				'2': 'hsl(var(--chart-2))',
// //   				'3': 'hsl(var(--chart-3))',
// //   				'4': 'hsl(var(--chart-4))',
// //   				'5': 'hsl(var(--chart-5))'
// //   			},
// //   			sidebar: {
// //   				DEFAULT: 'hsl(var(--sidebar-background))',
// //   				foreground: 'hsl(var(--sidebar-foreground))',
// //   				primary: 'hsl(var(--sidebar-primary))',
// //   				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
// //   				accent: 'hsl(var(--sidebar-accent))',
// //   				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
// //   				border: 'hsl(var(--sidebar-border))',
// //   				ring: 'hsl(var(--sidebar-ring))'
// //   			}
// //   		},
// //   		borderRadius: {
// //   			lg: 'var(--radius)',
// //   			md: 'calc(var(--radius) - 2px)',
// //   			sm: 'calc(var(--radius) - 4px)'
// //   		},
// //   		keyframes: {
// //   			'accordion-down': {
// //   				from: {
// //   					height: '0'
// //   				},
// //   				to: {
// //   					height: 'var(--radix-accordion-content-height)'
// //   				}
// //   			},
// //   			'accordion-up': {
// //   				from: {
// //   					height: 'var(--radix-accordion-content-height)'
// //   				},
// //   				to: {
// //   					height: '0'
// //   				}
// //   			}
// //   		},
// //   		animation: {
// //   			'accordion-down': 'accordion-down 0.2s ease-out',
// //   			'accordion-up': 'accordion-up 0.2s ease-out'
// //   		}
// //   	}
// //   },
// //   plugins: [require("tailwindcss-animate")],
// // };
// // export default config;


/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
	  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
	  "./components/**/*.{js,ts,jsx,tsx,mdx}",
	  "./app/**/*.{js,ts,jsx,tsx,mdx}",
	  "./src/**/*.{ts,tsx}",
	  "*.{js,ts,jsx,tsx,mdx}"
	],
	theme: {
	  container: {
		center: true,
		padding: "2rem",
		screens: {
		  "2xl": "1400px",
		},
	  },
	  extend: {
		fontFamily: {
		  sans: ["var(--font-sans)"],
		  mono: ["var(--font-mono)"],
		},
		colors: {
		  navbar: "hsl(var(--navbar))",
		  navbarForeground: "hsl(var(--navbar-foreground))",
		  background: "hsl(var(--background))",
		  foreground: "hsl(var(--foreground))",
		  card: {
			DEFAULT: "hsl(var(--card))",
			foreground: "hsl(var(--card-foreground))",
		  },
		  popover: {
			DEFAULT: "hsl(var(--popover))",
			foreground: "hsl(var(--popover-foreground))",
		  },
		  primary: {
			DEFAULT: "hsl(var(--primary))",
			foreground: "hsl(var(--primary-foreground))",
		  },
		  secondary: {
			DEFAULT: "hsl(var(--secondary))",
			foreground: "hsl(var(--secondary-foreground))",
		  },
		  muted: {
			DEFAULT: "hsl(var(--muted))",
			foreground: "hsl(var(--muted-foreground))",
		  },
		  accent: {
			DEFAULT: "hsl(var(--accent))",
			foreground: "hsl(var(--accent-foreground))",
		  },
		  destructive: {
			DEFAULT: "hsl(var(--destructive))",
			foreground: "hsl(var(--destructive-foreground))",
		  },
		  border: "hsl(var(--border))",
		  input: "hsl(var(--input))",
		  ring: "hsl(var(--ring))",
		  chart: {
			"1": "hsl(var(--chart-1))",
			"2": "hsl(var(--chart-2))",
			"3": "hsl(var(--chart-3))",
			"4": "hsl(var(--chart-4))",
			"5": "hsl(var(--chart-5))",
		  },
		  sidebar: {
			DEFAULT: "hsl(var(--sidebar-background))",
			foreground: "hsl(var(--sidebar-foreground))",
			primary: "hsl(var(--sidebar-primary))",
			"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
			accent: "hsl(var(--sidebar-accent))",
			"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
			border: "hsl(var(--sidebar-border))",
			ring: "hsl(var(--sidebar-ring))",
		  },
		},
		borderRadius: {
		  lg: "var(--radius)",
		  md: "calc(var(--radius) - 2px)",
		  sm: "calc(var(--radius) - 4px)",
		},
		keyframes: {
		  "accordion-down": {
			from: { height: 0 },
			to: { height: "var(--radix-accordion-content-height)" },
		  },
		  "accordion-up": {
			from: { height: "var(--radix-accordion-content-height)" },
			to: { height: 0 },
		  },
		},
		animation: {
		  "accordion-down": "accordion-down 0.2s ease-out",
		  "accordion-up": "accordion-up 0.2s ease-out",
		},
	  },
	},
	plugins: [require("tailwindcss-animate")],
  };
  