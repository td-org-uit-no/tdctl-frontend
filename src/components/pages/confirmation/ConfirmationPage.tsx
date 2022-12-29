import { confirmMember } from "api";
import { ToastStatus } from "contexts/toastProvider";
import { useToast } from "hooks/useToast";
import { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

const ConfirmationPage: React.FC = () => {
    const { confirmationCode } = useParams<{ confirmationCode: string }>();
    const { addToast } = useToast();
    const history = useHistory();

    var confirm = async function () {
        var status: ToastStatus = "success"
        var title: string = "User confirmed."
        try {
            await confirmMember(confirmationCode)
        } catch (error) {
            status = "error"
            title = "Confirmation code not found."
        }
        addToast({ status: status, title: title })
        history.push('/')
    }
    useEffect(() => { confirm() }, [])

    return (<></>)
}
export default ConfirmationPage