def nextGreaterElement(arr):
    out = ""
    if(len(arr) == 1 ):
        return -1
    for i in range(len(arr)):
        if(i == len(arr)-1):
            # out.append(-1)
            out += "-1 "
            break
        for j in range(i+1, len(arr)):
            if ((j == len(arr)-1) & (arr[j] <= arr[i])):
                    # out.append(-1)
                    out += "-1 "
            elif (arr[j] > arr [i]):
                # out.append(arr[j])
                out += f"{arr[j]} "
                break
            else:
                continue
    print(out)