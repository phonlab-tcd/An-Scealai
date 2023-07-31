SRC_DIR := src
DIST_DIR := dist

SRC_TS_JS_FILES := $(wildcard $(SRC_DIR)/*.ts $(SRC_DIR)/*.js)
ifndef NODE_ENV
NODE_ENV := dev
endif

ready: $(DIST_DIR)/server.js

$(DIST_DIR)/server.js: $(SRC_TS_JS_FILES)
	npx tsc
