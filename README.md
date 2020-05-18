kbn-plugin-graph - generate elastic search documents describing kibana plugins
================================================================================

Writes elasticsearch documents describing Kibana plugins.


usage
================================================================================

    kbn-plugin-graph

By default, writes the documents to `http://elastic:changeme@localhost:9200`,
but you can override that by setting the environment variable `ES_URL`.

The index the documents will be written to is `kbn-plugin-graph`.  That index
will  be deleted before the new documents are written to it.

Processes all `kibana.json` files found from the current directory, skipping
`build` and `template` directories.


install
================================================================================

    npm install -g pmuellr/kbn-plugin-graph


license
================================================================================

This package is licensed under the MIT license.  See the [LICENSE.md][] file
for more information.


contributing
================================================================================

Awesome!  We're happy that you want to contribute.

Please read the [CONTRIBUTING.md][] file for more information.


[LICENSE.md]: LICENSE.md
[CONTRIBUTING.md]: CONTRIBUTING.md
[CHANGELOG.md]: CHANGELOG.md