class HIDDebugger {
    constructor() {
        this.device = null;
        this.onReport = null;
    }

    async connect() {
        try {
            const devices = await navigator.hid.requestDevice({ filters: [] });
            if (devices.length === 0) return;
            
            this.device = devices[0];
            await this.device.open();

            this.device.addEventListener('inputreport', e => {
                if (this.onReport) this.onReport(e);
            });

            return this.device;
        } catch (err) {
            console.error('HID connection failed:', err);
            throw err;
        }
    }
}

const debugger_ = new HIDDebugger();
const btnConnect = document.getElementById('btn-connect');
const devName = document.getElementById('dev-name');
const devVid = document.getElementById('dev-vid');
const devPid = document.getElementById('dev-pid');
const terminal = document.getElementById('terminal');

btnConnect.addEventListener('click', async () => {
    try {
        const device = await debugger_.connect();
        if (!device) return;

        devName.textContent = device.productName;
        devVid.textContent = `0x${device.vendorId.toString(16).padStart(4, '0')}`;
        devPid.textContent = `0x${device.productId.toString(16).padStart(4, '0')}`;
        terminal.textContent = `Connected to ${device.productName}\nWaiting for reports...\n`;

        debugger_.onReport = (e) => {
            const { data, reportId } = e;
            const bytes = new Uint8Array(data.buffer);
            const now = new Date().toLocaleTimeString();

            let log = `[${now}] Report ID: ${reportId}, Length: ${bytes.length}\n`;
            
            // HEX
            const hex = Array.from(bytes)
                .map(b => b.toString(16).padStart(2, '0').toUpperCase())
                .join(' ');
            log += ` HEX: ${hex}\n`;

            // BIN
            const bin = Array.from(bytes)
                .map(b => b.toString(2).padStart(8, '0'))
                .join(' ');
            log += ` BIN: ${bin}\n`;

            // Simple button visual for the first byte
            if (bytes.length > 0) {
                log += ` B0 : `;
                for (let i = 7; i >= 0; i--) {
                    log += (bytes[0] & (1 << i)) ? '●' : '○';
                }
                log += '\n';
            }
            log += '-'.repeat(40) + '\n';

            // Update terminal (keep only last 100 lines)
            terminal.textContent = log + terminal.textContent;
            const lines = terminal.textContent.split('\n');
            if (lines.length > 500) {
                terminal.textContent = lines.slice(0, 500).join('\n');
            }
        };
    } catch (err) {
        terminal.textContent = `Error: ${err.message}\n` + terminal.textContent;
    }
});

// Check WebHID support
if (!('hid' in navigator)) {
    btnConnect.disabled = true;
    terminal.textContent = "⚠️ Your browser does not support WebHID API.\nPlease use Chrome or Edge.";
    terminal.style.color = "#ff4444";
}
