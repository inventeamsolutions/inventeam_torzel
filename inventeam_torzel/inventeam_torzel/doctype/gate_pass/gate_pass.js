frappe.ui.form.on("Gate Pass", {
    //refresh(frm) {
       
    //},
   gross_weight: function(frm) {
       updateTotalWeight(frm);
       differenceQty(frm);
   },
   net_weight: function(frm) {
       updateTotalWeight(frm);
   },
   total_bags: function(frm) {
       differenceBags(frm);
   },
   bag_no: function(frm) {
       differenceBags(frm);
   },
   total_gw_qty: function(frm) {
       differenceQty(frm);
   },
   validate: function(frm) {
       var gross_weight = frm.doc.gross_weight;
       var net_weight = frm.doc.net_weight;

       if(gross_weight < net_weight) {
           frappe.msgprint(__("Gross Weight cannot be less than Net Weight"));
           frappe.validated = false; 
       }
   }
});

function differenceQty(frm) {
   var total_gw_qty = frm.doc.total_gw_qty;
   var gross_weight = frm.doc.gross_weight;

   if(gross_weight && total_gw_qty) {
       var diff_qty = 0;
       diff_qty = gross_weight - total_gw_qty;
       frm.set_value('difference_gw', diff_qty);
       frm.refresh_field('difference_gw');
   } else {
       frm.set_value('difference_gw', '');
       frm.refresh_field('difference_gw');
   }
}

function differenceBags(frm) {
   var bag_no = frm.doc.bag_no;
   var total_bags = frm.doc.total_bags;

   if(bag_no && total_bags) {
       var diff_bags = 0;
       diff_bags = bag_no - total_bags;
       frm.set_value('difference_bags', diff_bags);
       frm.refresh_field('difference_bags');
   } else {
       frm.set_value('difference_bags', '');
       frm.refresh_field('difference_bags');
   }
}

function updateTotalWeight(frm) {
   var gross_weight = frm.doc.gross_weight;
   var net_weight = frm.doc.net_weight;

   if(gross_weight && net_weight) {
       var total_weight = 0;
       total_weight = gross_weight - net_weight;
       frm.set_value('total_weight', total_weight);
       frm.refresh_field('total_weight');
   } else {
       frm.set_value('total_weight', '');
       frm.refresh_field('total_weight');
   }
}

frappe.ui.form.on('Gate Pass Item', {
   bags_no: function (frm, cdt, cdn) {
       calculateQty(frm);
   },
   gross_qty: function (frm, cdt, cdn) {
       calculategrossQty(frm);
   }
});

function calculateQty(frm) {
   var totalBags = 0;

   $.each(frm.doc.item_table || [], function(index, item) {
       totalBags += item.bags_no || 0;
   });
   frm.set_value('total_bags', totalBags);
}

function calculategrossQty(frm) {
   var totalGrossQty = 0;

   $.each(frm.doc.item_table || [], function(index, item) {
       totalGrossQty += item.gross_qty || 0;
   });
   frm.set_value('total_gw_qty', totalGrossQty);
}