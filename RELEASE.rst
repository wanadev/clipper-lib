Things to do while releasing a new version
==========================================

This file is a memo for the maintainer.


0. Checks
---------

* Check there will be no trash in the package (``npm pack``)
* Remove the previously generated pack


1. Release
----------

* Build ``compiled-helper/*.js`` files: ``npm run compile``
* Edit / update changelog in ``ChangeLog.txt``
* Add changelog and compiled files to git staging ``git add ChangeLog.txt compiled-helper/*.js``
* Bump version and create tag with ``npm version [patch|minor|major]``
* ``git push && git push --tags``


3. Publish Github Release
-------------------------

* Make a release on Github
* Add changelog
