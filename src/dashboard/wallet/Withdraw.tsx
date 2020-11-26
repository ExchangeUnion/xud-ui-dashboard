import { Grid } from "@material-ui/core";
import React, { ReactElement, useEffect, useState } from "react";
import api from "../../api";
import { getCurrencyFullName } from "../../common/currencyUtil";
import { getErrorMsg } from "../../common/errorUtil";
import Loader from "../../common/Loader";
import { GetServiceInfoResponse } from "../../models/GetServiceInfoResponse";
import ErrorMessage from "./ErrorMessage";
import WithdrawAddress from "./WithdrawAddress";
import WithdrawalComplete from "./WithdrawalComplete";
import WithdrawAmount from "./WithdrawAmount";

type WithdrawProps = {
  currency: string;
  onClose: () => void;
};

type WithdrawView = {
  type: WithdrawViewType;
  component: ReactElement;
};

enum WithdrawViewType {
  AMOUNT = "AMOUNT",
  ADDRESS = "ADDRESS",
  COMPLETE = "COMPLETE",
}

const Withdraw = (props: WithdrawProps): ReactElement => {
  const { currency, onClose } = props;
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState(0);
  const [address, setAddress] = useState("");
  const [activeViewType, setActiveViewType] = useState(WithdrawViewType.AMOUNT);
  const [serviceInfo, setServiceInfo] = useState<
    GetServiceInfoResponse | undefined
  >(undefined);

  const views: WithdrawView[] = [
    {
      type: WithdrawViewType.AMOUNT,
      component: (
        <WithdrawAmount
          currency={currency}
          serviceInfo={serviceInfo!}
          onNext={(amount) => {
            setAmount(amount);
            setActiveViewType(WithdrawViewType.ADDRESS);
          }}
          initialAmount={amount}
        />
      ),
    },
    {
      type: WithdrawViewType.ADDRESS,
      component: (
        <WithdrawAddress
          currency={currency}
          amount={amount}
          serviceInfo={serviceInfo!}
          onComplete={(address) => {
            setAddress(address);
            setActiveViewType(WithdrawViewType.COMPLETE);
          }}
          changeAmount={(address) => {
            setAddress(address || "");
            setActiveViewType(WithdrawViewType.AMOUNT);
          }}
          currencyFullName={getCurrencyFullName(currency)}
          initialAddress={address}
        />
      ),
    },
    {
      type: WithdrawViewType.COMPLETE,
      component: (
        <WithdrawalComplete
          amount={amount}
          address={address}
          onClose={onClose}
        />
      ),
    },
  ];

  useEffect(() => {
    api.boltzServiceInfo$(currency).subscribe({
      next: (resp) => {
        setServiceInfo(resp);
        setFetchingData(false);
      },
      error: (err) => {
        setError(getErrorMsg(err));
        setFetchingData(false);
      },
    });
  }, [currency]);

  return (
    <>
      {fetchingData && <Loader />}
      {!!error && <ErrorMessage details={error} />}
      {!!serviceInfo &&
        views.map(
          (view) =>
            activeViewType === view.type && (
              <Grid
                item
                container
                direction="column"
                key={view.type}
                alignItems="center"
              >
                {view.component}
              </Grid>
            )
        )}
    </>
  );
};

export default Withdraw;
