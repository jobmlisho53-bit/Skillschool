#!/usr/bin/env python3
import random
import time
import os

stops = [
    "Laikipia University",
    "Cherika",
    "Nyumba Tatu",
    "Tairi Mbili",
    "Karuga",
    "Gavana",
    "Nyahururu"
]

passengers = 0
current_stop_index = 0

def clear_screen():
    os.system('clear')

def print_status():
    print("=" * 40)
    print(f"📍 Current stop: {stops[current_stop_index]}")
    print(f"👥 Passengers aboard: {passengers}")
    print("=" * 40)

def main():
    global passengers, current_stop_index
    clear_screen()
    print("🚐 KARIBU! Matatu Simulator 🚐")
    print(f"Route: Laikipia Uni → Nyahururu")
    input("Press Enter to start...")

    while current_stop_index < len(stops) - 1:
        clear_screen()
        print_status()
        input("Press Enter to continue to next stop...")
        current_stop_index += 1

    print("\n🎉 You reached Nyahururu! 🎉")
    print(f"Total passengers: {passengers}")

if __name__ == "__main__":
    main()
