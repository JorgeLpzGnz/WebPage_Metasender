import {  getTotalValue, isSameValue } from "./transactions.js";
import { getContract, handleError, handleTxFee  } from "./tools.js";
import metasender from "./contracts/metasender.js";
import { finalData  } from "./finalData.js";

async function sendNativeTokenSameValue( addresses, amounts ) {

	const contract = getContract( 
		metasender[`address_${ ethereum.chainId }`], 
		metasender.abi
	)

	const txFee = await handleTxFee();

	const gasEstimation = await contract.estimateGas
		.sendNativeTokenSameValue( addresses, amounts[0], 
			{ value: getTotalValue( amounts ).add(txFee) }
		)
		.catch( handleError );

	if( gasEstimation ) return gasEstimation

	else return ethers.utils.parseEther("0")
	
}

async function sendNativeTokenDifferentValue( addresses, amounts ) {

	const contract = getContract( 
		metasender[`address_${ ethereum.chainId }`], 
		metasender.abi
	)

	const txFee = await handleTxFee();

	const gasEstimation = await contract.estimateGas
		.sendNativeTokenDifferentValue(addresses, amounts, 
			{ value: getTotalValue( amounts ).add(txFee) }
		)
		.catch( handleError );

	if( gasEstimation ) return gasEstimation

	else return ethers.utils.parseEther("0")
	
}

async function sendERC20SameValue( contactAdd, addresses, amounts ) {

	const contract = getContract( 
		metasender[`address_${ ethereum.chainId }`], 
		metasender.abi
	)

	const txFee = await handleTxFee();

	const gasEstimation = await contract.estimateGas
		.sendERC20SameValue( contactAdd, addresses, amounts[0], 
			{ value: txFee }
		)
		.catch( handleError );

	if( gasEstimation ) return gasEstimation

	else return ethers.utils.parseEther("0")
	
}

async function sendERC20DifferentValue( contactAdd, addresses, amounts ) {

	const contract = getContract( 
		metasender[`address_${ ethereum.chainId }`], 
		metasender.abi
	)

	const txFee = await handleTxFee();

	const gasEstimation = await contract.estimateGas
		.sendERC20DifferentValue( contactAdd, addresses, amounts,
			{ value: txFee }
		)
		.catch( handleError );

	if( gasEstimation ) return gasEstimation

	else return ethers.utils.parseEther("0")
	
}


async function sendERC721( contactAdd, addresses, tokenIds ) {

	const contract = getContract( 
		metasender[`address_${ ethereum.chainId }`], 
		metasender.abi
	)

	const txFee = await handleTxFee();

	const gasEstimation = await contract.estimateGas
		.sendERC721( contactAdd, addresses, tokenIds,  
			{ value: txFee }
		)
		.catch( handleError );

	if( gasEstimation ) return gasEstimation

	else return ethers.utils.parseEther("0")

}

class MetasenderMethods {

	constructor() {

		this.sendNativeTokenDifferentValue = sendNativeTokenDifferentValue
		this.sendNativeTokenSameValue = sendNativeTokenSameValue
		this.sendERC20DifferentValue = sendERC20DifferentValue
		this.sendERC20SameValue = sendERC20SameValue
		this.sendERC721 = sendERC721

	}

}

export const mSestimateFunc = new MetasenderMethods()

export async function estimateTx() {

	let gasEstimation

	switch( finalData.tokenToSend ){

		case 'ETH':
			gasEstimation = await mSestimateFunc[
				`sendNativeToken${ isSameValue( finalData.amount ) }Value`
			]( finalData.wallets, finalData.amount )
			break

		case 'ERC20':
			gasEstimation = await mSestimateFunc[
				`sendERC20${ isSameValue( finalData.amount ) }Value`
			]( finalData.tokenAddress, finalData.wallets, finalData.amount );
			break

		case 'ERC721':
			gasEstimation = await mSestimateFunc.sendERC721( 
				finalData.tokenAddress,
				finalData.wallets, 
				finalData.amount
			);
			break

	}

	if ( gasEstimation ) return { verify: true, gasEstimation }
	
	else return { verify: false }

}