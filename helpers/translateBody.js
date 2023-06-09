const translateField = require("./translateField");

// Функція перекладу БОДІ
const translateBody = async (sourceLang, targetLang, body) => {
  const newBody = await Object.keys(body).reduce(async (acc, key) => {
    // База рекурсії
    if (typeof body[key] !== "object") {
      if (key === sourceLang) {
        // нормалізуємо таргетну мову для бази щоб в базі було UA
        const normalizedTargetLang = targetLang === "ua" ? "uk" : "en";
        // нормалізуємо ключ вхідної мови для функції перекладу на UK
        const normalizedFromLangKey = key === "ua" ? "uk" : "en";

        body[targetLang] = await translateField({
          text: await body[sourceLang],
          from: normalizedFromLangKey,
          to: normalizedTargetLang,
        });
        return await body;
      }

      return { ...(await acc), [key]: await body[key] };
    } else {
      // Наступний крок рекурсії
      return {
        ...(await acc),
        [key]: await translateBody(sourceLang, targetLang, await body[key]),
      };
    }
  }, {});

  return await newBody;
};

module.exports = translateBody;
