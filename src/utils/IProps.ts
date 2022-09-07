interface IProps {
    styles: {
        main: Record<string, Record<string, string>>,
        layouts: Record<string, Record<string, string>>,
        components: Record<string, Record<string, string>>,
        modules: Record<string, Record<string, string>>,
        pages: Record<string, Record<string, string>>,
        custom: Record<string, Record<string, string>>,
    }
}

export default IProps;