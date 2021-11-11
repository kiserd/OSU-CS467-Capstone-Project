import { useState } from 'react'
import Button from '../components/Button'
import Input from '../components/Input'

const Search = ({ onSearch }) => {
    const [searchValue, setSearchValue] = useState('')

    const sendSearch = (e) => {
        // prevent screen from reloading
        e.preventDefault
        // if search value is empty string, alert user
        if (searchValue.length === 0) {
            alert('please enter search term(s)')
        }
        else {
            onSearch(searchValue)
            setSearchValue('')
        }
    }
    return (
        <div className='flex'>
            <span className='flex-shrink self-center'>
                <Input type='text' value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
            </span>
            <span className='pl-2 flex-shrink-0'>
                <Button text='Search' type='btnPurple' onClick={sendSearch} />
            </span>
        </div>
    )
}

export default Search
