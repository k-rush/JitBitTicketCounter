import _mysql
import time
import datetime
import math
import pygame
from Adafruit_LED_Backpack import SevenSegment
import sys
#initialize displays


display = SevenSegment.SevenSegment(address=0x70)
display.begin()

#-----------display-------------------

#totalDisplay.clear()

digits = sys.argv[1]
display.clear()

display.set_digit(3, int(digits)%10) #ones
display.set_digit(2, int(int(digits)/10)%10) #tens
display.set_digit(1, int(int(digits)/100)%10) #hundreds
display.set_digit(0, int(int(digits)/1000)%10) #thousands
display.write_display()
