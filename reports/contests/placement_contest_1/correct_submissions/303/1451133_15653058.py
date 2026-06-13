def nextGreaterElement(arr):
    i = 0
    j = 1
    n = len(arr)-1

    while (i <= n):
        if (j > n):
            arr[i] = -1
            j = i+1
            i += 1 

        elif (arr[j] > arr[i]):
            arr[i] = arr[j]
            i += 1
            j = i+1

        else:
            j += 1

    # print (str(arr).join(" "))

    s = ""
    for i in range (len(arr)):
        s = s + str(arr[i])
        s = s + " "
    print (s)