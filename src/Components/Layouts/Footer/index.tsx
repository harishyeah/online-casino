import { useState } from 'react';

export default function Footer() {

    const [date, setDate] = useState(new Date().getFullYear());

    return (
        <footer className="sticky bottom-0">
            ©{date} Copyright All rights reserved.
        </footer>
    )
}