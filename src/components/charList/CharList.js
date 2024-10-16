import React, { Component} from 'react';
import PropTypes from 'prop-types';
import Spinner from '../Spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

class CharList extends Component {
    charFocusRef = React.createRef();

    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 315,
        charEnded: false,
        activeCharId: null
    }
    
    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    }

    charFocus = ()=> {
        if (this.charFocusRef.current) {
            console.log('Focus', this.charFocusRef.current)
            this.charFocusRef.current.focus();
        }
    }

    onRequest = (offset)=> {
        this.onCharListLoading()
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = ()=> {
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        this.setState(({offset, charList})=> ({
                charList: [...charList, ...newCharList],
                loading: false,
                newItemLoading: false,
                offset: offset + 9,
                charEnded: ended
            }), this.charFocus)
        // console.log(charList);
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    // Этот метод для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    renderItems(arr) {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li
                    ref={i == 0 ? this.charFocusRef : null}
                    className={`char__item ${item.id === this.state.activeCharId ? 'char__item_selected' : ''}`}
                    key={item.id}
                    onClick={()=> {
                        this.setState({activeCharId: item.id}, ()=> {
                            console.log(this.state.activeCharId)
                        })
                        this.props.onCharSelected(item.id)
                    }}
                    >
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {

        const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;
        
        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={()=> this.onRequest(offset)}
                    >
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;