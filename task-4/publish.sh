#!/bin/bash
sql2dbml --mysql charity-to-dbml.sql -o charity.dbml
dbdocs build charity.dbml --project=let-charity