#!/bin/bash

node enrollAdmin.js --orgMSP=academy --username=tan
node enrollAdmin.js --username=trinh
node registerUser.js --username=GV00 --orgMSP=academy --fullname=ABC --address=ABC --phonenumber=123 --password=123456
node registerUser.js --username=20156425 --orMSP=student --fullname=TrinhVanTan --address=TruongDinh --phonenumber=0382794668 --password=123456
