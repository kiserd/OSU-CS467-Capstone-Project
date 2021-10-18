import Search from '../components/Search'

const test_searchPage = () => {
    const onSearch = (searchString) => {
        console.log(searchString)
    }
    return (
        <div className='m-12 max-w-md'>
            <Search onSearch={onSearch} />
        </div>
    )
}

export default test_searchPage
