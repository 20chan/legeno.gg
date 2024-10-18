#!/bin/bash
cp prisma/dev.db prisma/backups/$(date +"%F-%T").db
