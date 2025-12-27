const FDS = document.getElementById('FDS');
const FADRS = document.getElementById('ResultSection');
FDS.addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const val = {
        NS : parseFloat(data.NangSuat),
        pH : parseFloat(data.gt_pH),
        HC : parseFloat(data.gt_HC),
        NT : parseFloat(data.gt_NT),
        PD : parseFloat(data.gt_PD),
        KD : parseFloat(data.gt_KD)
    }
    if (Object.values(val).some(value => isNaN(value))) {
        return res.status(400).json({
            error: "Lỗi: Một hoặc nhiều dữ liệu nhập vào không hợp lệ (không phải là số)!"
        });
    }

    // algorithm 
    const nx = {
        pH : (val.pH==0?"pH ?":(val.pH<=4.5?"rất chua":(val.pH<=5?"chua":(val.pH<=5.5?"hơi chua":(val.pH<=6.5?"ít chua":(val.pH<=7.5?"trung bình":"kiềm")))))),
        HC : (val.HC==0?"HC ?":(val.HC<2.5?"rất nghèo":(val.HC<=3.5?"nghèo":(val.HC<=4?"trung bình":(val.HC<=4.5?"trung bình khá":(val.HC<=5?"khá":"giàu")))))),
        NT : (val.NT==0?"N ?":(val.NT<0.1?"rất nghèo":(val.NT<=0.14?"nghèo":(val.NT<=0.18?"trung bình":(val.NT<=0.21?"trung bình khá":(val.NT<=0.25?"khá":"giàu")))))),
        PD : (val.PD==0?"P ?":(val.PD<3?"rất nghèo":(val.PD<=4.5?"nghèo":(val.PD<=6?"trung bình":(val.PD<=9?"trung bình khá":(val.PD<=25?"khá":"giàu")))))),
        KD : (val.KD==0?"K ?":(val.KD<10?"rất nghèo":(val.KD<=15?"nghèo":(val.KD<=20?"trung bình":(val.KD<=25?"trung bình khá":(val.KD<=60?"khá":"giàu"))))))
    }
    const pc = {
        NS : (val.NS==0?"NS ?":(val.NS<=1.5?0:(val.NS<=2?1:(val.NS<=2.5?2:(val.NS<=3?3:(val.NS<=3.5?4:(val.NS<=4?5:(val.NS<=4.5?6:(val.NS<=5?7:(val.NS<=5.5?8:(val.NS<=6?9:(val.NS<=6.5?10:(val.NS<=7?11:(val.NS<=7.5?12:(val.NS<=8?13:(val.NS<=8.5?14:(val.NS<=9?15:(val.NS<=9.5?16:(val.NS<=10?17:(val.NS<=10.5?18:(val.NS<=11?19:(val.NS<=11.5?20:(val.NS<=12?21:22))))))))))))))))))))))),
        HC : (val.HC==0?"HC ?":(val.HC<2.5?6:(val.HC<=3.5?5:(val.HC<=4?4:(val.HC<=4.5?3:(val.HC<=5?2:1)))))),
        NT : (val.NT==0?"N ?":(val.NT<0.1?6:(val.NT<=0.14?5:(val.NT<=0.18?4:(val.NT<=0.21?3:(val.NT<=0.25?2:1)))))),
        PD : (val.PD==0?"P ?":(val.PD<3?6:(val.PD<=4.5?5:(val.PD<=6?4:(val.PD<=9?3:(val.PD<=25?2:1)))))),
        KD : (val.KD==0?"K ?":(val.KD<10?6:(val.KD<=15?5:(val.KD<=20?4:(val.KD<=25?3:(val.KD<=60?2:1))))))
    }
    
    const BSA = Math.round((0.905*(20+50*pc.NS+(pc.NT-1)*20)*0.625)/5)*5,
    URE = Math.round((1.761*(20+50*pc.NS+(pc.NT-1)*20)*0.625)/5)*5,
    LNC = Math.round((6.25*(30+15*pc.NS+(pc.PD-1)*15)*0.625)/5)*5,
    KCL = Math.round((1.667*(25+25*pc.NS+(pc.KD-1)*20)*0.625)/5)*5,
    BTE = Math.round(((50+10*pc.NS+(pc.KD-1)*10)*0.625)/5)*5,
    URE1 = Math.round(URE*0.1),
    URE2 = Math.round(URE*0.1),
    URE3 = Math.round(URE*0.3),
    URE4 = Math.round(URE*0.25),
    URE5 = Math.round(URE*0.2),
    URE6 = URE - (URE1 + URE2 + URE3 + URE4 + URE5),
    LNC1 = Math.round(LNC*0.6/5)*5,
    LNC5 = LNC - LNC1,
    KCL1 = Math.round(KCL*0.05),
    KCL2 = Math.round(KCL*0.05),
    KCL3 = Math.round(KCL*0.15),
    KCL4 = Math.round(KCL*0.2),
    KCL5 = Math.round(KCL*0.25),
    KCL6 = KCL - (KCL1 + KCL2 + KCL3 + KCL4 + KCL5),
    BTE3 = Math.round(BTE*0.3),
    BTE4 = Math.round(BTE*0.3),
    BTE6 = BTE - (BTE3 + BTE4),
    HC = (val.HC<=2.5?"Để cải thiện hàm lượng hữu cơ đất bón phân chuồng hoai 5-10 kg/trụ,1-2 năm/lần.":(val.HC<=3.5?"Để cải thiện hàm lượng hữu cơ đất bón phân chuồng hoai 5-10 kg/trụ, 2-3 năm/lần.":(val.HC<=4?"Để cải thiện hàm lượng hữu cơ đất bón phân chuồng hoai 5-10 kg/trụ,3-4 năm/lần.":(val.HC<=5?"Để cải thiện hàm lượng hữu cơ đất bón phân chuồng hoai 5-10 kg/trụ,4-5 năm/lần.":"Vì hàm lượng hữu cơ đất ở mức giàu, nên không cần phải bón phân hữu cơ.")))) + (val.HC<=0?"pH ?":(val.HC<=5?" Đào rãnh theo 1/4-1/2 tán cây, rộng 20cm, sâu 15-20cm, bón phân và lấp lại; có thể vùi thêm tàn dư thực vật và bón men Tricho Nema với lượng 10-20g/rãnh. Có thể bón phân hữu cơ vi sinh thay phân chuồng (quy đổi 1:5).":" Để duy trì hàm lượng hữu cơ đất có thể xẻ rãnh ép xanh, bằng cách đào rãnh theo 1/4-1/2 tán cây, rộng 20 cm, sâu 15-20 cm; vùi tàn dư thực vật vào rãnh, rắc 20g men Tricho Nema và lấp đất.")),
    VOI = (val.pH<4?"Bón vôi 800 gam/trụ, chia 2 lần bón khi đất đủ ẩm":(val.pH<4.5?"Bón vôi 600 gam/trụ, chia 2 lần bón khi đất đủ ẩm":(val.pH<5?"Bón vôi 500 gam/trụ, chia 2 lần bón khi đất đủ ẩm":(val.pH<5.5?"Bón vôi 400 gam/trụ, bón một lần khi đất đủ ẩm":(val.pH<6?"Bón vôi 300 gam/trụ, bón một lần khi đất đủ ẩm":(val.pH<6.5?"Bón vôi 200 gam/trụ, bón một lần khi đất đủ ẩm":(val.pH<7.5?"Đất trung tính, không bón vôi":"Đất bị kiềm, cần xem xét xử lý mặn")))))));
    

    const rp = {
        dat : `Đất ${nx.pH} (${val.pH}), hữu cơ ${nx.HC} (${val.HC}), đạm tổng số ${nx.NT} (${val.NT}), lân dễ tiêu ${nx.PD} (${val.PD}), kali dễ tiêu ${nx.KD} (${val.KD}).`,
        VOI : (val.pH<6.5?"Để cải thiện độ chua đất, tăng khả năng hấp thụ dinh dưỡng của cây, cung cấp canxi;":"") +  VOI + (val.pH<6.5?".Bón vào đầu mùa mưa, cuối mùa mưa, vãi đều trên mặt khi đất ẩm, tiếp xúc với đất càng nhiều càng tốt.":"."),
        HC : HC,
        VC : `Để ổn định và duy trì khoáng chất bón (${URE} g urê, ${BSA} g SA, ${LNC} g Lân nung chảy, ${KCL} g KCl, ${BTE} g trung vi lượng).\n\t+ Phục hồi cây : ${URE1} g urê, ${KCL1} g KCl, ${LNC1} g Lân nung chảy.\n\t+ Bón mùa khô : ${URE2} g urê, ${KCL2} g KCl, ${BSA} g SA.\n\t+ Bón thúc bông : ${URE3} g urê, ${KCL3} g KCl, ${BTE3} g trung vi lượng\n\t+ Bón nuôi trái : ${URE4} g urê, ${KCL4} g KCl, ${BTE4} g trung vi lượng.\n\t+ Bón thúc trái : ${URE5} g urê, ${KCL5} g KCl, ${LNC5} g Lân nung chảy.\n\t+ Bón tăng dem : ${URE6} g urê, ${KCL6} g KCl, ${BTE6} g trung vi lượng.\nBón theo mép tán cây khi đất đủ ẩm và lập nhẹ.`
    }

    FDS.style.display = 'none';
    FADRS.style.display = 'block';

    document.querySelector('#dat').innerHTML = rp.dat;
    document.querySelector('#VOI').innerHTML = rp.VOI;
    document.querySelector('#HC').innerHTML = rp.HC;
    document.querySelector('#VC').innerHTML = rp.VC;
    
});
