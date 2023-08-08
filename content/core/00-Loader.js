/// <summary>
/// Executes a callback function when the condition is met
/// </summary>
/// <param name="validator">Validator function</param>
/// <param name="callback">Callback function that receives the element</param>
/// <param name="validator">Time interval between checks in milliseconds</param>
function AddTimedWatch(validator, callback, time)
{
    function caller()
    {
        setTimeout(function() {
            if (validator())
            {
                callback();
            }
            setTimeout(caller, time);
        }, 0);
    }

    setTimeout(caller, 0);
}

function AddHashWatch(validator, callback)
{
    function caller()
    {
        if (validator())
        {
            callback();
        }
        else
        {
            setTimeout(caller, 200);
        }
    }

    setTimeout(caller, 0);
}