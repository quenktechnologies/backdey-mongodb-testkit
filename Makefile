
lib: src
	rm -R $@ 2> /dev/null || true 
	mkdir $@
	cp -R -u src/* $@
	./node_modules/.bin/tsc --project $@
	touch $@

src: $(shell find src -type f)
	touch $@

# Generate typedoc documentation.
.PHONY: docs
docs: lib
	./node_modules/.bin/typedoc \
	--mode modules \
	--out $@ \
	--tsconfig src/tsconfig.json \
	--theme minimal \
	--exclude node_modules\
	--excludeNotExported \
	--excludePrivate && \
	echo "" > docs/.nojekyll
