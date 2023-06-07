SHELL := /bin/bash

.PHONY: help
help:
	@echo "Usage make <TARGET>"
	@echo ""
	@echo "  Targets:"
	@echo "	   build-server			Build the server; typescript to node"
	@echo "	   run					Run the server from javascript code"
	@echo "	   docker-server		Containerize the server"
	@echo "	   docker-run			Run server container"
	@echo "	   kind					Add to kind so that we can setup in ingress controller"
	@echo "	   test-server			Test server via curl"


.PHONY: build-server
build-server:
	tsc

.PHONY: run
run:
	node ./build/server.js

.PHONY: docker-server
docker-server:
	docker build --rm=true -t architecting-software/demo-vue-cli .

.PHONY: docker-run
docker-run:
	docker run --rm -p 9550:80 architecting-software/demo-vue-cli

.PHONY: kind
kind:
	kind load docker-image architecting-software/demo-vue-cli

.PHONY: test-server
test-server:
	curl "localhost:9500/students" | json_pp 