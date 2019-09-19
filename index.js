const iconsData = require('./iconsList.json');

module.exports = function SkillResets(mod) {
    let lastReset = { time: null, icon: null };

    function getSkillBase(skill) {
        return Math.floor(skill / 10000);
    }

    mod.hook('S_CREST_MESSAGE', 2, ({ type, skill }) => {
        if (type === 6) {
            let icon = iconsData[mod.game.me.class][skill] || iconsData[mod.game.me.class][getSkillBase(skill)];
            if (lastReset.icon !== icon || (lastReset.icon === icon && (Date.now() - lastReset.time > 15))) {
                lastReset.icon = icon;
                lastReset.time = Date.now();
                mod.send('S_CUSTOM_STYLE_SYSTEM_MESSAGE', 1, {
                    message: `<img src="img://__${icon}" width="48" height="48" vspace="-20"/><font size="24" color="${mod.settings.reset_font_color}">&nbsp;Reset</font>`,
                    style: mod.settings.resetStyle
                });
            }
            if (mod.settings.sound)
                mod.send('S_PLAY_SOUND', 1, { SoundID: mod.settings.soundId });

            if (!mod.settings.show_system_reset_message)
                return false;
        }
    });
};
