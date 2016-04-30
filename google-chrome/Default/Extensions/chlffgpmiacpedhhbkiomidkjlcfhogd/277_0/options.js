'use strict';

var textMappings = {
    'mute-app-question': 'how_to_unmute_app',
    'mute-app-answer': 'how_to_unmute_app_answer'
};

var categories = {
    'general': {
        'label': text.get('general'),
        'options': [{
            'key': 'backgroundPermission',
            'label': text.get('option_background_permission'),
            'desc': text.get('option_background_permission_desc'),
            'cssClasses': ['chrome', 'windows']
        }, {
            'key': 'useDarkIcon',
            'label': text.get('option_use_dark_icon'),
            'desc': text.get('option_use_dark_icon_desc'),
            'cssClasses': ['chrome']
        }, {
            'key': 'showNotificationCount',
            'label': text.get('option_show_notification_count'),
            'desc': text.get('option_show_notification_count_desc'),
            'cssClasses': ['chrome']
        }, {
            'key': 'openMyLinksAutomatically',
            'label': text.get('option_open_my_pushes_automatically'),
            'desc': text.get('option_open_my_pushes_automatically_desc')
        }, {
            'key': 'automaticallyAttachLink',
            'label': text.get('option_automatically_attach_link'),
            'desc': text.get('option_automatically_attach_link_desc')
        }]
    },
    'notifications': {
        'label': text.get('notifications'),
        'options': [{
            'key': 'showMirrors',
            'label': text.get('option_show_mirrors'),
            'desc': text.get('option_show_mirrors_desc')
        }, {
            'key': 'onlyShowTitles',
            'label': text.get('option_only_show_titles'),
            'desc': text.get('option_only_show_titles_desc')
        }, {
            'key': 'playSound',
            'label': text.get('option_play_sound'),
            'desc': text.get('option_play_sound_desc'),
            'cssClasses': ['chrome']
        }]
    },
    'advanced': {
        'label': text.get('advanced'),
        'options': [{
            'key': 'showContextMenu',
            'label': text.get('option_show_context_menu'),
            'desc': text.get('option_show_context_menu_desc'),
            'cssClasses': ['chrome']
        }, {
            'key': 'clipboardPermission',
            'label': text.get('option_clipboard_permission'),
            'desc': text.get('option_clipboard_permission_desc'),
            'cssClasses': ['chrome', 'not-mac']
        }, {
            'key': 'allowInstantPush',
            'label': text.get('option_allow_instant_push'),
            'desc': text.get('option_allow_instant_push_desc'),
            'cssClasses': ['chrome']
        }]
    }
};

window.init = function() {
    Object.keys(textMappings).forEach(function(key) {
        document.getElementById(key).textContent = text.get(textMappings[key]);
    });

    document.getElementById('logo-link').href = pb.www;
    document.getElementById('version').textContent = 'v' + pb.version;

    if (pb.local && pb.local.user) {
        document.getElementById('account-holder').style.display = 'block';
        document.getElementById('account-image').src = pb.local.user.image_url || 'chip_user.png';
    }

    setUpOptions();

    if (window.location.hash) {
        var hashTab = document.getElementById('tab-' + window.location.hash.substring(1).toLowerCase());
        if (hashTab) {
            hashTab.onclick();
        }
    } else {
        document.getElementById('tab-' + Object.keys(categories)[0]).onclick();
    }

    pb.track({
        'name': 'goto',
        'url': '/options'
    });
};

var setUpOptions = function() {
    var tabsHolder = document.getElementById('tabs');
    var optionsHolder = document.getElementById('options');

    var resetTabs = function() {
        Object.keys(categories).forEach(function(key) {
            var tab = document.getElementById('tab-' + key);
            tab.className = 'tab';
            var tabOptions = document.getElementById('tab-' + key + '-options');
            tabOptions.style.display = 'none';
        });
    };

    var fillOptions = function(category, container) {
        category.options.forEach(function(option) {
            var div = renderOption(option);
            container.appendChild(div);
        });
    };

    var renderOption = function(option) {
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = option.key + '-checkbox';
        checkbox.checked = pb.settings[option.key];
        checkbox.onclick = function() {
            localStorage[option.key] = checkbox.checked;
            optionsChanged();
        };

        var labelText = document.createElement('span');
        labelText.className = 'option-title';
        labelText.textContent = option.label;

        var label = document.createElement('label');
        label.id = option.key + '-label';
        label.className = 'option-label';
        label.appendChild(checkbox);
        label.appendChild(labelText);

        var desc = document.createElement('div');
        desc.className = 'option-desc';
        desc.textContent = option.desc;

        var div = document.createElement('div');
        div.id = option.key;
        div.className = 'option';
        div.appendChild(label);
        div.appendChild(desc);

        if (option.cssClasses) {
            option.cssClasses.forEach(function(cssClass) {
                div.classList.add(cssClass);
            });
        }

        return div;
    };

    Object.keys(categories).forEach(function(key) {
        var category = categories[key];

        var tab = document.createElement('div');
        tab.id = 'tab-' + key;
        tab.href = '#' + key;
        tab.textContent = category.label;
        tab.className = 'tab';
        tab.onclick = function() {
            resetTabs();
            tab.className = 'tab selected';
            tabOptions.style.display = 'block';
            window.location.hash = key;
        };

        tabsHolder.appendChild(tab);

        var tabOptions = document.createElement('div');
        tabOptions.id = 'tab-' + key + '-options';
        fillOptions(category, tabOptions);

        optionsHolder.appendChild(tabOptions);
    });

    addDurationOption();

    addEndToEndOption();

    if (window.chrome) {
        setUpChromePermissionOptions();
        setUpInstantPushOptions();
    }

    checkNativeClient();
};

var optionsChanged = function() {
    pb.loadSettings();
};

var addDurationOption = function() {
    var notificationsOptions = document.getElementById('tab-notifications-options');

    var duration = document.createElement('div');
    duration.className = 'option option-desc';

    var label = document.createElement('span');
    label.className = 'option-label';
    label.style.display = 'inline';
    label.textContent = text.get('option_notification_duration');

    var durationSelect = document.createElement('select');
    durationSelect.style.marginLeft = '6px';

    var option1 = document.createElement('option');
    option1.value = '8';
    option1.textContent = '8 seconds';

    var option2 = document.createElement('option');
    option2.value = '0';
    option2.selected = 'true';
    option2.textContent = '30 seconds';

    durationSelect.add(option1);
    durationSelect.add(option2);

    if (!localStorage.notificationDuration || localStorage.notificationDuration == '0') {
        durationSelect.selectedIndex = 1;
    } else {
        durationSelect.selectedIndex = 0;
    }

    durationSelect.onchange = function() {
        localStorage.notificationDuration = durationSelect.options[durationSelect.selectedIndex].value;
        optionsChanged();
    };

    duration.appendChild(label);
    duration.appendChild(durationSelect);
    duration.classList.add('chrome');
    duration.classList.add('not-opera');

    notificationsOptions.insertBefore(duration, notificationsOptions.firstChild);
};

var setUpChromePermissionOptions = function() {
    var backgroundPermission = document.getElementById('backgroundPermission');
    var backgroundPermissionCheckbox = document.getElementById('backgroundPermission-checkbox');

    (function() {
        var hasPermission, permission = { 'permissions': ['background'] };

        var onPermissionUpdate = function(granted) {
            hasPermission = !!granted;
            backgroundPermissionCheckbox.checked = hasPermission;
        };

        chrome.permissions.contains(permission, onPermissionUpdate);

        backgroundPermissionCheckbox.addEventListener('click', function(event) {
            if (hasPermission) {
                chrome.permissions.remove(permission,
                    function(removed) {
                        onPermissionUpdate(!removed);
                    }
                );
            } else {
                chrome.permissions.request(permission, onPermissionUpdate);
            }
        });
    })();

    var clipboardPermission = document.getElementById('clipboardPermission');
    var clipboardPermissionCheckbox = document.getElementById('clipboardPermission-checkbox');

    (function() {
        var hasPermission, permission = { 'permissions': ['clipboardRead', 'clipboardWrite'] };

        var onPermissionUpdate = function(granted) {
            hasPermission = !!granted;
            clipboardPermissionCheckbox.checked = hasPermission;

            if (hasPermission) {
                clipboardPermission.style.display = 'block';
            }
        };

        chrome.permissions.contains(permission, onPermissionUpdate);

        clipboardPermissionCheckbox.addEventListener('click', function(event) {
            if (hasPermission) {
                chrome.permissions.remove(permission,
                    function(removed) {
                        onPermissionUpdate(!removed);
                    }
                );
            } else {
                chrome.permissions.request(permission, onPermissionUpdate);
            }
        });
    })();
};

var setUpInstantPushOptions = function() {
    var deviceSelect = document.createElement('select');
    deviceSelect.style.marginLeft = '6px';

    var instantPushLabel = document.getElementById('allowInstantPush-label');
    instantPushLabel.appendChild(deviceSelect);

    var instantPushCheckbox = document.getElementById('allowInstantPush-checkbox');

    if (pb.local.user) {
        var onclick = instantPushCheckbox.onclick;

        deviceSelect.disabled = !instantPushCheckbox.checked;

        var instantOptionsChanged = function() {
            deviceSelect.disabled = !instantPushCheckbox.checked;

            if (instantPushCheckbox.checked) {
                localStorage.instantPushIden = deviceSelect.value;
            } else {
                delete localStorage['instantPushIden'];
            }

            onclick();
        };

        instantPushCheckbox.onclick = instantOptionsChanged;

        if (pb.local.devices) {
            var deviceKeys = Object.keys(pb.local.devices),
                device, deviceOption;

            deviceOption = document.createElement('option');

            deviceOption.value = '*';
            deviceOption.textContent = text.get('all_of_my_devices');

            deviceSelect.add(deviceOption);

            deviceKeys.map(function(key) {
                device = pb.local.devices[key];
                deviceOption = document.createElement('option');

                deviceOption.value = device.iden;
                deviceOption.textContent = device.nickname;

                deviceSelect.add(deviceOption);
            });
        }

        deviceSelect.onchange = instantOptionsChanged;

        if (localStorage.instantPushIden) {
            deviceSelect.value = localStorage.instantPushIden;
        } else if (deviceSelect.children.length) {
            deviceSelect.value = deviceSelect.firstChild.value;
        }

        var shortcutLink = document.createElement('a');

        chrome.commands.getAll(function(commands) {
            var command, linkText = ' ' + text.get('option_instant_push_shortcuts');
            for (var commandKey in commands) {
                command = commands[commandKey];

                if (command.name === 'instant-push-current-tab' && command.shortcut) {
                    shortcutLink.textContent = String.format(linkText, command.shortcut);
                    return;
                }
            }

            shortcutLink.textContent = String.format(linkText, text.get('option_instant_push_shortcuts_not_set'));
        });

        document.getElementById('allowInstantPush').lastChild.appendChild(shortcutLink);

        shortcutLink.onclick = function() {
            pb.openTab('chrome://extensions/configureCommands');
        };
    } else {
        instantPushCheckbox.checked = false;
        instantPushCheckbox.disabled = true;
    }
};

var addEndToEndOption = function() {
    var advancedOptions = document.getElementById('tab-advanced-options');

    var container = document.createElement('div');
    container.className = 'option option-desc';

    var top = document.createElement('div');

    var label = document.createElement('span');
    label.className = 'option-label';
    label.style.display = 'inline';
    label.textContent = text.get('end_to_end_password_label');

    var input = document.createElement('input');
    input.type = 'password';
    input.style.display = 'inline-block';
    input.style.width = '200px';
    input.style.border = '1px solid #95a5a6';
    input.style.padding = '4px 6px';
    input.style.marginLeft = '20px';
    input.value = pb.e2e.enabled ? btoa(pb.e2e.key) : '';

    var save = document.createElement('button');
    save.style.height = '28px';
    save.style.padding = '0';
    save.style.marginLeft = '10px';
    save.style.border = '1px solid transparent';
    save.style.padding = '0 5px';
    save.textContent = text.get('save');

    save.onclick = function() {
        pb.e2e.setPassword(input.value);
    };

    input.onkeypress = function(e) {
        if (e.keyCode == 13) {
            pb.e2e.setPassword(input.value);
        }
    };

    input.onfocus = function(e) {
        input.value = '';
    };

    top.appendChild(label);
    top.appendChild(input);
    top.appendChild(save);

    container.appendChild(top);

    var bottom = document.createElement('div');
    bottom.textContent = text.get('end_to_end_password_desc');

    container.appendChild(bottom);

    advancedOptions.appendChild(container);
};

var checkNativeClient = function() {
    var generalTab = document.getElementById('tab-general');
    var notificationsTab = document.getElementById('tab-notifications');
    var clipboardPermission = document.getElementById('clipboardPermission');

    utils.checkNativeClient(function(response) {
        if (response) {
            generalTab.onclick();
            notificationsTab.style.display = 'none';
            clipboardPermission.style.display = 'none';
        }
    });
};
