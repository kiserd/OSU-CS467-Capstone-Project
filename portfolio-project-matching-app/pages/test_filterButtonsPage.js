import FilterButtons from '../components/FilterButtons'

const test_filterButtonsPage = () => {
    const technologies = [
        {id: 1, name: 'Javascript'},
        {id: 2, name: 'Python'},
        {id: 3, name: 'React'},
        {id: 4, name: 'Flutter'},
        {id: 5, name: 'C++'},
        {id: 6, name: 'Next.js'},
        {id: 7, name: 'Typescript'},
        {id: 8, name: 'HTML'},
        {id: 9, name: 'PROLOG'}
    ]

    const filterOnSelected = (selection) => {
        // todo
        console.log(selection.name);
    }
    return (
        <div className='m-12 max-w-md border-2 border-gray-400 rounded-md'>
            <FilterButtons category='Technologies' choices={technologies} onClick={filterOnSelected} />
        </div>
    )
}

export default test_filterButtonsPage
