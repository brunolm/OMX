if (!ManagerAddsSystem) var ManagerAddsSystem = { };
if (!ManagerAddsSystem.OrkutManager) ManagerAddsSystem.OrkutManager = { };

ManagerAddsSystem.OrkutManager.PrefManager =
function ()
{
	var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.orkutmanager.");
	
	var o =
	{
		branch : "extensions.orkutmanager.",

		exists : function (prefName) { return pref.getPrefType(prefName) != 0; },
		
	/* Public */
		Clear : function (prefName) { pref.clearUserPref(prefName); },
		Del : function (prefName) { pref.deleteBranch(prefName); },
		Reset :
			function ()
			{
				var branch = o.branch;
				var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
				var vals = prefs.getChildList(branch, {});
				for (var key in vals)
				{
					try
					{
						key = vals[key].replace(branch, "");
						ManagerAddsSystem.OrkutManager.PrefManager.Clear(key);
					}
					catch (ex) { }
				}
			},
		Get :
			function(prefName, defaultValue)
			{
				var prefType = pref.getPrefType(prefName);
				
				switch (prefType)
				{
					case pref.PREF_STRING: return pref.getCharPref(prefName);
					case pref.PREF_BOOL: return pref.getBoolPref(prefName);
					case pref.PREF_INT: return pref.getIntPref(prefName);
					default: return defaultValue;
				}
			},

		Set :
			function(prefName, value)
			{
				var prefType = typeof(value);

				switch (prefType)
				{
					case "string":
					case "boolean": break;
					case "number":
						if (value % 1 != 0)
							throw new Error("Cannot set preference to non integral number");
						break;
					default:
						throw new Error("Cannot set preference with datatype: " + prefType);
				}

				if (o.exists(prefName) && prefType != typeof(o.Get(prefName))) o.Del(prefName);

				switch (prefType)
				{
					case "string": pref.setCharPref(prefName, value); break;
					case "boolean": pref.setBoolPref(prefName, value); break;
					case "number": pref.setIntPref(prefName, Math.floor(value)); break;
				}
			},
			
		Export :
			function ()
			{
				var branch = o.branch;
				var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
				var vals = prefs.getChildList(branch, {});
				
				var values = [];
				for (var key in vals)
				{
					try
					{
						key = vals[key].replace(branch, "");
						values.push(key + "," + escape(ManagerAddsSystem.OrkutManager.PrefManager.Get(key)));
					}
					catch (ex) { }
				}
				return uneval(values);
			},
			
		Import :
			function (Cfgs)
			{
				if (Cfgs.length < 2) return;
				try
				{
					var values = JSON.parse(Cfgs);
					for (var val in values)
					{
						var block = values[val].split(",");
						var key = block[0];
						var value = unescape(block[1]);
						
						value = (value == "true") ? true : value;
						value = (value == "false") ? false : value;
						if (parseInt(value)) value = parseInt(value);
						ManagerAddsSystem.OrkutManager.PrefManager.Set(key, value);
					}
				}
				catch (ex) { }
			}
	};
	
	return o;
	
}();