import re

with open('src/pages/DriverDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add imports
import_target = "import React, { useState, useEffect, useRef } from 'react';"
import_replace = import_target + "\nimport { setupBackground, enableBackgroundMode, disableBackgroundMode, triggerRideNotification } from '../utils/background';"
content = content.replace(import_target, import_replace)

# 2. Add setupBackground to initial effect
init_target = r'''  useEffect(() => {
    fetchDriverActiveRide();'''
init_replace = r'''  useEffect(() => {
    setupBackground();
    fetchDriverActiveRide();'''
content = content.replace(init_target, init_replace)

# 3. Enable background when going online
online_target = r'''    setIsOnline(true);
    setIsPaused(false);
    const email = localStorage.getItem('driverEmail');'''
online_replace = r'''    setIsOnline(true);
    setIsPaused(false);
    enableBackgroundMode();
    const email = localStorage.getItem('driverEmail');'''
content = content.replace(online_target, online_replace)

# 4. Disable background when going offline
offline_target = r'''  const goOffline = () => {
    setIsOnline(false);
    setIsPaused(false);
    const email = localStorage.getItem('driverEmail');'''
offline_replace = r'''  const goOffline = () => {
    setIsOnline(false);
    setIsPaused(false);
    disableBackgroundMode();
    const email = localStorage.getItem('driverEmail');'''
content = content.replace(offline_target, offline_replace)

# 5. Trigger notification on new ride
incoming_target = r'''            if (data) {
              // New incoming ride detected!
              if (!incomingRide || incomingRide.id !== data.id) {
                setIncomingRide(data);'''
incoming_replace = r'''            if (data) {
              // New incoming ride detected!
              if (!incomingRide || incomingRide.id !== data.id) {
                setIncomingRide(data);
                triggerRideNotification(data.pickup, data.dropoff);'''
content = content.replace(incoming_target, incoming_replace)

with open('src/pages/DriverDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("DriverDashboard background mode injected.")
