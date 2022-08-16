const exec = require('util').promisify(require('child_process').exec)
const homedir = require('os').homedir();

function realOrQa(real,qa) {
    if(process.env.run_type === 'real') return real;
    else return qa;
}


const config = {
  connect: {
    host: '141.95.1.243',
    username: 'scealai',
    privateKeyPath: require('path').join(homedir,'.ssh','id_rsa').toString(),
  },
  database: realOrQa('an-scealai','qa'),
  cwd: realOrQa('An-Scealai','an_scealai_qa')
};

async function client() {
    return await (new (require('node-ssh').NodeSSH)).connect(config.connect);
}

function error(r) {
    if(r.code) { process.exit(r.code) }
}

const currentBranch = new Promise(async (resolve,reject)=>{
    const {stdout,stderr} = await exec('git symbolic-ref --short HEAD').catch(err=>{console.error(err);process.exit(1)});
    if(stderr) return reject();
    resolve(stdout);
})

const onMaster = new Promise(async(resolve,reject)=>{
    resolve(!!(await currentBranch).match(/^master\n$/));
})

async function main() {
    if(process.env.run_type === 'real' && await onMaster) {
        console.error('refusing to publish to real site when not on master');
        process.exit(1);
    }
    async function run(cmd,exit_on_failure=true) { 
        const r = await ssh.execCommand(cmd,{cwd: config.cwd});
        console.log(r);
        if(exit_on_failure) error(r);
    }
    const ssh = await client();
    await run('git status');
    await run('git stash');
    await run('git pull');
    await run(`git checkout ${await currentBranch}`);
    await run('git pull');
    await run('bash shell/deploy_current_branch_without_building.sh');
};

module.export = main;
if(require.main === module) 
    main()
    .then(process.exit,process.exit);
