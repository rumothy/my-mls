import React, {useState, useEffect } from 'react';

const MyAutocomplete = (props) => {
    const [key, setKey] = useState('');
    const [keys, setKeys] = useState([]);
    const [matches, setMatches] = useState([]);
    // const [matches, setMatches] = useState([{ id: 0, key: 'Afghanistan', val: 0 }]);
    // ['Afghanistan', 'Albania', 'Algeria']

    useEffect(()=>{
        setKeys(props.keys);
    },[keys]);

    const handleTyping = event => {
        const val = event.target.value;
        setKey(val);
        if (!val) return false;
        const newMatches = [];
        for (let i = 0; i < keys.length; i++) {
            if (keys[i].substr(0, val.length).toUpperCase() === val.toUpperCase()){
                newMatches.push({ id: i, key: keys[i], chars: val.length });
                setMatches(newMatches);
            }
        }
    };

    const handleOptionClick = event => {
        setKey(event.target.innerText);
        setMatches([]);
        props.locationSelected(event.target.innerText);
    };

    const onLostFocus = event => {
        setTimeout(()=>{
            setMatches([]);
          }, 2000);
    }

    return ( 
        <div>
            <input 
                id='myInput' type='text' name='myKey' 
                placeholder="Key" onChange={handleTyping} value={key}
                onBlur={onLostFocus}
            />
            <div id='autocomplete-list'>
                {matches.map(match =>  
                    <div key={match.id} onClick={handleOptionClick}>
                        <strong>{match.key.substr(0, match.chars)}</strong>{match.key.substr(match.chars)}
                    </div>
                )}
            </div>
        </div> 
    );
}
 
export default MyAutocomplete;