import { Component } from 'react';


import './charList.scss';
import Spinner from '../spinner/spinner';
import MarvelService from '../../services/MarvelService';

class CharList extends Component {
    state = {
        characters: [],
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    // componentDidMount() {                            // //  первый вариант
    //     this.marvelService.getAllCharacters()
    //         .then(characters => this.setState({characters, loading: false}))
    //         .catch(error=> {
    //             console.log(error);
    //             this.setState({loading: false});
    //         });
    // }

    // componentDidMount() {                            // // второй вариант
    //     this.marvelService.getAllCharacters()
    //         .then((characters) => {
    //             const filterCharacters = characters.filter(char=> char.thumbnail && !char.thumbnail.includes('image_not_available'));
    //             this.setState({characters: filterCharacters, loading: false}) 
    //         })
    //         .catch(error=> {
    //             console.log(error);
    //             this.setState({loading: false});
    //         });
    // }

    componentDidMount() {
        this.loadCharacters();
    }

    loadCharacters = async ()=> {                                       // //третий вариант
        try {
            let allCharacters = [];
            let totalCharacters = 0;
            const requiredCharacters = 9;
            let offset = 0;

            while (totalCharacters < requiredCharacters) {
                const characters = await this.marvelService.getAllCharacters(offset);
                const filterCharacters = characters.filter(char=> char.thumbnail && !char.thumbnail.includes('image_not_available'));

                if (filterCharacters.length === 0) break;

                allCharacters = [...allCharacters, ...filterCharacters];
                totalCharacters = allCharacters.length;

                offset += characters.length;
            }

            this.setState({characters: allCharacters.slice(0, requiredCharacters), loading: false});
        } catch (error) {
            console.log(error);
            this.setState({ loading: false, error: true });
        }
    }


    render() {
        const {characters, loading} = this.state;

        if (loading) {
            return <Spinner/>
        }

        return (
            <div className="char__list">
                <ul className="char__grid">
                    {characters.map(char=> (
                        <li key={char.id} 
                            onClick={()=> this.props.onCharSelected(char.id)} 
                            className="char__item char__item_selected">
                            <img src={char.thumbnail} alt={char.name} />
                            <div className="char__name">{char.name}</div> 
                        </li>
                    ))}
                    {/* <li className="char__item">
                        <img src={abyss} alt="abyss"/>
                        <div className="char__name">Abyss</div>
                    </li>
                    <li className="char__item char__item_selected">
                        <img src={abyss} alt="abyss"/>
                        <div className="char__name">Abyss</div>
                    </li> */}
                </ul>
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
    
}

export default CharList;