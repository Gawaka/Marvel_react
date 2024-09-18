class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';           // // ссылка на api
    _apiKey = 'apikey=44ea9d55b5b931eb16b58f5322bd8b9a';                // // key api

    getResource = async (url)=> {                                       // // Метод по отправлке запроса на получение
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    // getAllCharacters = async ()=> {
    //     const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
    //     return res.data.results.map(this._transformAllCharacters);  // //  ПЕрвый вариант
    // }

    getAllCharacters = async (offset = 0)=> {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        return res.data.results.map(this._transformAllCharacters);
    }

    _transformAllCharacters = (char) => {
        return {
            id: char.id,
            name: char.name,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension
        }
    }

    getCharacter = async (id)=> {                                                                   // // Метод получающий 1 персонажа
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);     
        return this._transformCharacter(res.data.results[0]);  // // Возвращаем объект для трансформации дальше передаем его как char
    }

    _transformCharacter = (char) => {
        return {
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url
        }
    }
}

export default MarvelService;