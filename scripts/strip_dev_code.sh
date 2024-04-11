#!/bin/bash

grep -vE "DeveloperNavBar|DevDataBar|Transition|PresentationNavBar" ./src/App.vue > tmpindex
mv tmpindex ./src/App.vue
