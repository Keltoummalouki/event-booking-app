import '@testing-library/jest-dom'

// Mock Next.js Image
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props) => {
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        return <img {...props} />
    },
}))

// Mock Next.js Link
jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }) => {
        return <a href={href}>{children}</a>
    },
}))

// Mock useRouter
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
        }
    },
    usePathname() {
        return ''
    },
}))
