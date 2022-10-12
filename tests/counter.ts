import * as anchor from "@project-serum/anchor";
import {BN} from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Counter } from "../target/types/counter";
import {PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY} from "@solana/web3.js";

interface CounterEvent {
  oldCount: BN,
  newCount: BN
}

const CounterEventName = "CounterEvent";

const CounterAccountPrefix = "COUNTER";

let counterAccountPda: PublicKey;

const handleCounterEvent = (ev: CounterEvent) =>
    console.log(`${CounterEventName} ==>`, {
      old_count: ev.oldCount.toNumber(),
      new_count: ev.newCount.toNumber()
    });

describe("counter", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Counter as Program<Counter>;


  const counterEventListener = program.addEventListener(CounterEventName, handleCounterEvent);


  it("get Pda", async () => {
    [counterAccountPda] = await PublicKey.findProgramAddress(
        [
          Buffer.from(CounterAccountPrefix)
        ], program.programId);

    console.log("Counter Account PDA: ", counterAccountPda.toBase58());
  });


  it("Counter !", async () => {
    // Add your test here.
    const tx = await program.methods.count()
        .accounts({
          payer: anchor.AnchorProvider.env().wallet.publicKey,
          counterAccount: counterAccountPda,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY
        })
        .rpc();
    console.log("Your transaction signature", tx);

    await delay(1000);

    console.log("Counter Account Data: ", (await program.account.counterAccount.fetch(counterAccountPda)));

  });

    it("Counter 2", async () => {
        // Add your test here.
        const tx = await program.methods.count()
            .accounts({
                payer: anchor.AnchorProvider.env().wallet.publicKey,
                counterAccount: counterAccountPda,
                systemProgram: SystemProgram.programId,
                rent: SYSVAR_RENT_PUBKEY
            })
            .rpc();
        console.log("Your transaction signature", tx);

        await delay(1000);

        console.log("Counter Account Data: ", (await program.account.counterAccount.fetch(counterAccountPda)));

    });

    it("Counter 3", async () => {
        // Add your test here.
        const tx = await program.methods.count()
            .accounts({
                payer: anchor.AnchorProvider.env().wallet.publicKey,
                counterAccount: counterAccountPda,
                systemProgram: SystemProgram.programId,
                rent: SYSVAR_RENT_PUBKEY
            })
            .rpc();
        console.log("Your transaction signature", tx);

        await delay(1000);

        console.log("Counter Account Data: ", (await program.account.counterAccount.fetch(counterAccountPda)));

    });

  it("Remove Event", async () => {

    await delay(1000);

    await program.removeEventListener(counterEventListener);

  });
});


function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
