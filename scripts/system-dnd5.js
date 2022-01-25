export function InitDND5() {
  //Сортировка списка навыков в алфавитном порядке
  async function sortSkillsAlpha() {
    const lists = document.getElementsByClassName("skills-list");
    for (let list of lists) {
      const competences = list.childNodes;
      let complist = [];
      for (let sk of competences) {
        if (sk.innerText && sk.tagName == "LI") {
          complist.push(sk);
        }
      }
      complist.sort(function (a, b) {
        return a.innerText.localeCompare(b.innerText);
      });
      for (let sk of complist) {
        list.appendChild(sk);
      }
    }
  }

  Hooks.on("renderActorSheet", async function () {
    sortSkillsAlpha();
  });

  // Выбор источника перевода
  game.settings.register("ru-ru-DnDno", "altTranslation", {
    name: "Использовать альтернативный перевод",
    hint: "(Требуется модуль libWrapper) Использовать альтернативный перевод D&D5e от Phantom Studio. Иначе будет использоваться официальный перевод издательства Hobby World.",
    type: Boolean,
    default: false,
    scope: "world",
    config: true,
    restricted: true,
    onChange: (value) => {
      window.location.reload();
    },
  });

  // Настройка активации Babele
  game.settings.register("ru-ru-DnDno", "compendiumTranslation", {
    name: "Перевод библиотек",
    hint: "(Требуется модуль Babele) Некоторые библиотеки системы D&D5e будут переведены.",
    type: Boolean,
    default: true,
    scope: "world",
    config: true,
    restricted: true,
    onChange: (value) => {
      window.location.reload();
    },
  });


  if (game.settings.get("ru-ru-DnDno", "altTranslation")) {
    if (typeof libWrapper === "function") {
      libWrapper.register("ru-ru-DnDno", "game.i18n._getTranslations", loadAltTranslation, "MIXED");
    } else {
      new Dialog({
        title: "Альтернативный перевод",
        content: `<p>Для использования альтернативного перевода требуется активировать модуль <b>libWrapper</b>.</p>`,
        buttons: {
          done: {
            label: "Хорошо",
          },
        },
      }).render(true);
    }
  }

  // Alternative D&D5 translation
  async function loadAltTranslation(wrapped, lang) {
    const translations = await wrapped(lang);
    const promises = [];

    promises.push(this._loadTranslationFile(`modules/ru-ru/i18n/systems/dnd5e-alt.json`));

    await Promise.all(promises);
    for (let p of promises) {
      let json = await p;
      foundry.utils.mergeObject(translations, json, { inplace: true });
    }
    
    return translations;
  }

  // Регистрация Babele
  if (typeof Babele !== "undefined") {
    Babele.get().register({
      module: "ru-ru-DnDno",
      lang: "ru",
      dir: (game.settings.get("ru-ru-DnDno", "altTranslation")) ? "compendium/dnd5e-alt" : "compendium/dnd5e",
    });
  } else {
    if (game.settings.get("ru-ru-DnDno", "compendiumTranslation")) {
      new Dialog({
        title: "Перевод библиотек",
        content: `<p>Для перевода библиотек системы D&D5 требуется установить и активировать модуль <b>Babele</b>. Вы можете отключить перевод библиотек в настройках модуля, чтобы это окно больше не отображалось.</p>`,
        buttons: {
          done: {
            label: "Хорошо",
          },
        },
      }).render(true);
    }
  }


}
