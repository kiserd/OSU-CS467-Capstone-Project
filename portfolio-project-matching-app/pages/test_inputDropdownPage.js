import InputDropdown from '../components/InputDropdown'
import Input from '../components/Input'
import Button from '../components/Button'

const test_inputDropdownPage = () => {
    const timezones = [
        {id: 1, name:'Pacific'},
        {id: 2, name:'Mountain'},
        {id: 3, name:'Central'},
        {id: 4, name:'Eastern'}
    ]
    return (
        <div className='m-12'>
            <InputDropdown choices={timezones} name='Timezone' />
            <Input name='dummy' type='text' placeholder='input' />
            <Button text='Button' type='btnGeneral' />
        </div>
    )
}

export default test_inputDropdownPage
