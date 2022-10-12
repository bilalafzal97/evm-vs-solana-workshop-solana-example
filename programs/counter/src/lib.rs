use anchor_lang::prelude::*;

declare_id!("A3y481xxDy8NNKxQ7r5deNvfPW4TRvQrknp1zo7RVb5v");

#[program]
pub mod counter {
    use super::*;

    pub fn count(ctx: Context<CounterArgs>) -> Result<()> {

        let counter_account: &mut Account<CounterAccount> = &mut ctx.accounts.counter_account;

        let old_count = counter_account.count;

        counter_account.count = counter_account.count + 1;

        let event: CounterEvent = CounterEvent {
            new_count: counter_account.count,
            old_count
        };

        emit!(event);

        msg!("oldCount={0}, newCount={1}", old_count, counter_account.count);

        Ok(())
    }
}

pub const COUNTER_ACCOUNT_PREFIX: &str = "COUNTER";

#[account]
pub struct CounterAccount {
    pub count: u64,
}

impl CounterAccount {
    pub fn space() -> usize {
        8 // default
            + 8 // count
    }
}

#[derive(Accounts)]
pub struct CounterArgs<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
    init_if_needed,
    payer = payer,
    space = CounterAccount::space(),
    seeds = [
    COUNTER_ACCOUNT_PREFIX.as_bytes()
    ],
    bump,
    )]
    pub counter_account: Account<'info, CounterAccount>,

    pub system_program: Program<'info, System>,

    pub rent: Sysvar<'info, Rent>,
}

#[event]
pub struct CounterEvent {
    pub old_count: u64,

    pub new_count: u64
}