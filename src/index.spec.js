/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const COLOR = {
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  RESET: '\x1b[0m',
};

const spaceCase = text => text.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();

function print(text, color = COLOR.RESET) {
  process.stdout.write(`${color}${text}${COLOR.RESET}`);
}

fs.readdir(path.join(__dirname, 'tests'), (err, testFiles) => {
  if (err) {
    console.error(err.stack);
    process.exit(1);
    return;
  }

  const failures = [];
  Promise.all(
    testFiles.map(testFile => new Promise((resolve) => {
      const absoluteTestPath = path.join(__dirname, 'tests', testFile);
      const test = spawn('node', [absoluteTestPath]);
      const testName = testFile.split('.spec.js')[0];

      const output = [];
      test.stdout.on('data', (data) => {
        output.push(data.toString());
      });
      test.stderr.on('data', (data) => {
        output.push(data.toString());
      });

      test.on('close', (code) => {
        print(`${spaceCase(testName)}... `);

        if (code === 0) {
          print('OK\n', COLOR.GREEN);
        } else {
          failures.push(testName);
          print('FAIL\n', COLOR.RED);
        }

        console.log(output.join('\n'));
        resolve();
      });
    })),
  ).then(() => {
    console.log('Test run complete:');
    console.log(`  Total: ${testFiles.length}`);

    print('  Pass:  ');
    print(testFiles.length - failures.length, COLOR.GREEN);
    print('\n');

    print('  Fail:  ');
    print(failures.length, failures.length ? COLOR.RED : COLOR.GREEN);
    print('\n');

    process.exit(failures.length);
  });
});
