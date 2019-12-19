export class EmailBody {

    getStatusEmailBody(order_id:string, name:string, status:string, note:string){
        return `
        <table style="width:600px;border:17px solid #fbfcfc;margin-left:auto;margin-right:auto" bgcolor="#FBFCFC">
        <tbody>
            <tr>
                <td style="width:600px" bgcolor="#FBFCFC"><a
                        href="https://tacgifts.com" target="_blank"
                        data-saferedirecturl="https://www.google.com/url?q=https://tacgifts.com&amp;source=gmail&amp;ust=1563620188133000&amp;usg=AFQjCNEsj0bDx87ecBxnVCfRfINEXLCDXA"><img
                            style="display:block;margin-left:auto;margin-right:auto"
                            src="https://firebasestorage.googleapis.com/v0/b/taconlinegiftshop.appspot.com/o/logos%2Ftac_logo.png?alt=media&token=a760ac9c-ffce-4aa7-a578-ca7ff24132eb"
                            alt="TAC" width="210" class="CToWUd"></a></td>
            </tr>
            <tr>
                <td style="width:600px" bgcolor="#dc457e" height="5px"></td>
            </tr>
    
    
            <tr>
                <td style="width:600px" bgcolor="#FBFCFC"><a
                        href="https://tacgifts.com"
                        target="_blank"
                        data-saferedirecturl="https://www.google.com/url?q=https://tacgifts.com&amp;source=gmail&amp;ust=1563620188133000&amp;usg=AFQjCNHnHpiDVxR2cIm7BJ4DfpaLTT9tkw"><img
                            style="display:block;margin-left:auto;margin-right:auto" width="600"
                            src="https://firebasestorage.googleapis.com/v0/b/taconlinegiftshop.appspot.com/o/promo%20images%2F_MG_2295e.jpg?alt=media&token=0007eca1-a469-47ce-b0ef-9deab2e19266"
                            alt="Confirmed order" class="CToWUd"></a></td>
            </tr>
    
    
    
            <tr>
                <td align="center" valign="top"
                    style="font-size:24px;font-family:'Open Sans',Arial,Helvetica,sans-serif;color:#1c2c3a">Order ID <span
                        style="color:#dc457e">${order_id}</span></td>
            </tr>
    
    
    
    
    
    
            <tr>
                <td align="left" valign="top">
                    <font style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#212121;line-height:20px">
                        <br> Hi ${name},<br><br>
                        Thanks for ordering with TAC.<br>
                        ${note}<br></font>
                </td>
            </tr>
    
            <tr>
                <td height="20" valign="top"></td>
            </tr>
    
            <tr>
                <td align="center" style="padding:10px;border:2px dashed #999999">
                    <strong>
                        <font style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#353535">
    
    
    
                            Order Current Status:
    
                        </font>
                        <font style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#eb603b">${status}</font>
                    </strong>
                </td>
            </tr>
    
            <tr>
                <td height="20" valign="top"></td>
            </tr>
    
            <tr>
                <td align="left" valign="top">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                        <tbody>
                            <tr>
                                <td colspan="2">&nbsp;</td>
                            </tr>
                            <tr>
                                <td colspan="2" align="left"
                                    style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#212121">
    
    
    
                                    If you have any questions about your order, don't hesitate to call us at +234
                                    814 2630 028<br><br>
    
                                </td>
                            </tr>
    
    
                            <tr>
                                <td style="width:600px" bgcolor="#dc457e" height="2.5px" colspan="3"></td>
                            </tr>
                            <tr>
                                <td colspan="2">
    
                                    <a href="https://tacgifts.com"
                                        target="_blank"
                                        data-saferedirecturl="https://www.google.com/url?q=https://tacgifts.com&amp;source=gmail&amp;ust=1563620188133000&amp;usg=AFQjCNFfHCzFxLGZ37H8tfUTGv6REOwa7Q"><img
                                            width="600px"
                                            src="https://firebasestorage.googleapis.com/v0/b/taconlinegiftshop.appspot.com/o/promo%20images%2F_MG_2295e.jpg?alt=media&token=0007eca1-a469-47ce-b0ef-9deab2e19266"
                                            class="CToWUd"></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
    
        </tbody>
    </table>
        `
    }
}