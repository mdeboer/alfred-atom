'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var path = require('path');
var octicons = require('octicons');

var Icons = require('./icons');

var Project = function () {
    function Project() {
        (0, _classCallCheck3.default)(this, Project);
    }

    (0, _createClass3.default)(Project, [{
        key: '_fileExists',
        value: function _fileExists(path) {
            try {
                fs.statSync(path);
                return true;
            } catch (err) {
                return false;
            }
        }
    }, {
        key: '_uid',
        value: function _uid(project) {
            return project.title.toLowerCase().replace(' ', '_');
        }
    }, {
        key: '_title',
        value: function _title(project) {
            var title = project.title;

            if (project.group) {
                title += ' - ' + project.group;
            }

            return title;
        }
    }, {
        key: '_subtitle',
        value: function _subtitle(project) {
            if (project.paths) {
                return project.paths.join(', ');
            }

            return '';
        }
    }, {
        key: '_icon',
        value: function _icon(project) {
            var iconPaths = [];

            if (project.icon) {
                if (project.icon.startsWith('icon-')) {
                    var iconPath = path.join(__dirname, 'icons', project.icon.slice(5) + '.png');
                    if (this._fileExists(iconPath)) {
                        return iconPath;
                    }
                }

                if (project.icon.startsWith('~/')) {
                    var homedir = process.env.HOME || '';
                    project.icon = path.resolve(homedir, project.icon.slice(2));
                }

                if (!path.isAbsolute(project.icon)) {
                    for (var i = 0; i < project.paths.length; i++) {
                        iconPaths.push(path.resolve(project.paths[i], project.icon));
                    }
                }

                if (this._fileExists(project.icon)) {
                    return project.icon;
                }
            }

            for (var _i = 0; _i < project.paths.length; _i++) {
                iconPaths.push(path.join(project.paths[_i], 'icon.png'));
            }

            for (var _i2 = 0; _i2 < iconPaths.length; _i2++) {
                if (this._fileExists(iconPaths[_i2])) {
                    return iconPaths[_i2];
                }
            }

            return 'icon.png';
        }
    }, {
        key: '_atomArgument',
        value: function _atomArgument(project) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

            var atomPath = process.env.atomPath || '/usr/local/bin/atom';

            var command = [atomPath];

            command = command.concat(options);

            if (project.paths) {
                command.push('"' + project.paths.join('" "') + '"');
            }

            return command.join(' ');
        }
    }, {
        key: '_openArgument',
        value: function _openArgument(project, app) {
            var command = ['open', '-a', `"${app}"`];

            if (project.paths) {
                command.push('"' + project.paths.join('" "') + '"');
            }

            return command.join(' ');
        }
    }, {
        key: 'parse',
        value: function parse(project) {
            var item = {
                title: this._title(project),
                subtitle: this._subtitle(project),
                icon: {
                    path: this._icon(project)
                },
                arg: this._atomArgument(project),
                valid: project.paths && project.paths.length > 0,
                mods: {
                    alt: {
                        valid: true,
                        subtitle: 'Open project path(s) in terminal',
                        arg: this._openArgument(project, process.env.terminalApp || 'Terminal')
                    },
                    cmd: {
                        valid: true,
                        subtitle: 'Open in new window',
                        arg: this._atomArgument(project, ['-n'])
                    },
                    ctrl: {
                        valid: true,
                        subtitle: 'Open in development mode',
                        arg: this._atomArgument(project, ['-d'])
                    },
                    fn: {
                        valid: true,
                        subtitle: 'Append project path(s) to last open window',
                        arg: this._atomArgument(project, ['-a'])
                    },
                    shift: {
                        valid: true,
                        subtitle: 'Open project path(s) in finder',
                        arg: this._openArgument(project, 'Finder')
                    }
                }
            };

            return item;
        }
    }, {
        key: 'parseAll',
        value: function parseAll(projects) {
            var result = [];

            for (var i = 0; i < projects.length; i++) {
                result.push(this.parse(projects[i]));
            }

            return result;
        }
    }]);
    return Project;
}();

module.exports = new Project();