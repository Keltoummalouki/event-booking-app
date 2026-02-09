import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import SimpleButton from '../SimpleButton'

describe('SimpleButton', () => {
    it('renders with label', () => {
        render(<SimpleButton label="Click me" />)
        expect(screen.getByRole('button')).toHaveTextContent('Click me')
    })
})
