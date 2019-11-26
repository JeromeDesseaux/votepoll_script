const puppeteer = require('puppeteer')
var faker = require('faker');

faker.locale = "fr";


const setInputValue = async (page, selector, value) => {
    const element = await page.$(selector);
    await element.type(value);
}

const setDropdown = async (page, selector) => {
    const choices = ["Femme", "Homme"];
    setInputValue(page, selector, choices[getRandomAge(0,2)]);
    // await page.keyboard.press('Enter');
    const firstElement = '.css-26l3qy-menu';
    await page.waitForSelector(firstElement);
    // console.log("found")
    // await page.click(firstElement);
    page.keyboard.press("Tab");
}

const getRandomAge = (min, max) => {
    return Math.floor(Math.random() * max) + min
}


const upVote = async () => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    
    // 2 - Créer un compte
    const firstNameRaw = faker.name.firstName();
    const lastNameRaw = faker.name.lastName();
    const emailRaw = firstNameRaw.replace(/ /g,'').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()+"."+lastNameRaw.replace(/ /g,'').toLowerCase()+getRandomAge(1,50).toString()+"@gmail.com"
    await page.goto('https://participer.grandparissud.fr/fr-FR/sign-up')
    await page.waitFor('input[id=firstName]');
    await setInputValue(page, "input[id=firstName]", firstNameRaw);
    await setInputValue(page, "input[id=lastName]", lastNameRaw);
    await setInputValue(page, "input[id=email]", emailRaw);
    await setInputValue(page, "input[id=password]", "caputdraconis");
    
    await page.evaluate(() => {
        document.querySelector("input[type='checkbox']").click();
        document.querySelector("#e2e-signup-step1-button > button[type='submit']").click();
    });
    
    await page.waitFor("input[id=root_votre_commune]");
    await setInputValue(page, "input[id=root_votre_commune]", "Paris");
    await setInputValue(page, "input[id=root_votre_age]",  getRandomAge(13,30).toString());
    await page.evaluate(() => {
        document.querySelector(".css-2b097c-container").click();
    });
    await setDropdown(page, "input[id=root_genre]");
    await page.keyboard.press('Enter');

    // 3 - Aller sur la page du projet
    await page.goto('https://participer.grandparissud.fr/fr-FR/ideas/un-espace-mandala-et-une-fresque-comme-supports-de-la-biodiversite');
    await page.waitFor('.VoteControl__Upvote-h9cg2l-5');
    const upVote = '.VoteControl__Upvote-h9cg2l-5';
    await page.click(upVote);
    
    // 4 - Fermer le navigateur
      browser.close()
}


const run = async (howMany) => {
    for (i = 0; i < howMany; i++) {
        await upVote();
    } 
}


run(110)