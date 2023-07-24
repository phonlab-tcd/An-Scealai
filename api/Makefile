SRC_DIR := src
DIST_DIR := dist

SRC_TS_JS_FILES := $(wildcard $(SRC_DIR)/*.ts $(SRC_DIR)/*.js)
ifndef NODE_ENV
NODE_ENV := dev
endif

ready: dist/server.js dist/keys dist/sendinblue.json dist/monitoring

dist/server.js: $(WEBPACK_CONFIG) $(SRC_TS_JS_FILES)
	npx tsc

dist/$(NODE_ENV)-server.js: $(WEBPACK_CONFIG) $(SRC_TS_JS_FILES)
	watch=false npx webpack --progress --config $(WEBPACK_CONFIG)

dist/sendinblue.json:
	cp sendinblue.json $@

.PHONY: dist/keys
dist/keys: dist/jwtRS256.key dist/jwtRS256.key.pub

dist/jwtRS256.key dist/jwtRS256.key.pub:
	cp keys/dev/jwt* dist/