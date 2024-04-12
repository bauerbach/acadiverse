import Globals from '../globals';

export const getBoolean = (key) => {
    return new Promise((resolve, reject) => {
        var value = false;
        fetch(`${Globals.API_URL}/globalSettings/retrieve/?key=${key}&settingType=BOOLEAN`)
        .then((res) => res.json())
        .then((setting) =>
        {
            console.log(setting);
            if(setting.invalidKey != null)
            {
                reject(false);
            }
            else
            {
                resolve(setting.value);
            }
        });
    });
}

export const getNumber = (key) => {
    return new Promise((resolve, reject) => {
        var value = false;
        fetch(`${Globals.API_URL}/globalSettings/retrieve/?key=${key}&settingType=NUMBER`)
        .then((res) => res.json())
        .then((setting) =>
        {
            console.log(setting);
            if(setting.invalidKey != null)
            {
                reject(0);
            }
            else
            {
                resolve(setting.value);
            }
        });
    });
}

export const getString = (key) => {
    return new Promise((resolve, reject) => {
        var value = false;
        fetch(`${Globals.API_URL}/globalSettings/retrieve/?key=${key}&settingType=STRING`)
        .then((res) => res.json())
        .then((setting) =>
        {
            console.log(setting);
            if(setting.invalidKey != null)
            {
                reject("");
            }
            else
            {
                resolve(setting.value);
            }
        });
    });
}

const GlobalSettingsService = {
    getBoolean,
    getNumber,
    getString
};

export default GlobalSettingsService;