frappe.ui.form.on('Purchase Order', {
	refresh: function (frm) {
		console.log(frm.doc.gate_pass);
	    frm.set_query("gate_pass", function(doc, cdt, cdn){
            let d = locals[cdt][cdn];
            return {
                "filters": [
                    ["Gate Pass", "docstatus", "=", 1 ],
                    ["Gate Pass", "supplier", "=", d.supplier ],
					['name', 'not in', getLinkedGatePasses(d.supplier)]
                ]
            };
        });
	},
	gate_pass: function (frm) {
	    if (frm.doc.gate_pass != null && frm.doc.gate_pass != "") {
	         frappe.call({
    			method: "frappe.client.get_list",
    			args: {
    				doctype: "Gate Pass",
    				filters: {
                        name: frm.doc.gate_pass,
                    },
                    fields: ["total_gw_qty"] 
    			},
    			callback(data) {
    				let gate_pass_list = data.message;
                    if (gate_pass_list && gate_pass_list.length > 0) {
                        let gate_pass_data = gate_pass_list[0]; // Access the first item in the list
                        frm.set_value("custom_total_accepted_qty", gate_pass_data.total_gw_qty);
                    } else {
                        console.error("Gate Pass not found");
                    }
    				
    			},
    			async: false,
    		});
	    }
	   
	},
	supplier_name: function (frm) {
	    frm.set_value("gate_pass", "");
	    frm.set_value("custom_total_accepted_qty", null);
	},
	validate: function (frm){
	    var total_po_qty = 0;
	    var total_gw_qty = 0;
	    if (frm.doc.custom_total_accepted_qty != null && frm.doc.custom_total_accepted_qty != "") {
	        total_gw_qty = parseFloat(frm.doc.custom_total_accepted_qty);
	    }
	    if (frm.doc.total_qty != null && frm.doc.total_qty != "") {
	        total_po_qty = parseFloat(frm.doc.total_qty);
	    }
	    console.log(total_po_qty);
	    console.log(total_gw_qty);
	    if (total_po_qty > total_gw_qty) {
	        frappe.msgprint({
                title: __('Validation Error'),
                indicator: 'red',
                message: __('Total PO Quantity should not be greater than Gate Pass accepted Quantity'),
                primary_action: {
                    action: function () {
                        frm.reload_doc();
                    },
                    label: __('OK')
                }
            });
            frappe.validated = false;
	    }
	}
})

// Function for excluding already attached Gate Passes 
function getLinkedGatePasses(supplier) {
    let linkedGatePasses = [];
    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: "Purchase Order",
            filters: {
                supplier: supplier,
				status: ["!=", "Cancelled"]
            },
            fields: ["gate_pass"]
        },
        async: false,
        callback: function(data) {
            if (data && data.message) {
                linkedGatePasses = data.message.map(po => po.gate_pass);
            }
        }
    });
    return linkedGatePasses;
}