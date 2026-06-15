def nextGreaterElement(arr):
    n = len(arr)
    l=[]
    for i in range(n):
        curr = arr[i]
        great = -1
        pre = i - 1 
        succ = i + 1
        while succ < n:
            # if pre >= 0:
            #     if great < arr[pre] and arr[pre] > curr:
            #         great = arr[pre]
            #     pre = pre - 1
            if succ < n:
                if great < arr[succ] and arr[succ] > curr:
                    great = arr[succ]
                succ = succ + 1
            # print(i, pre, succ, great)
            if great != -1:
                break
        print(great, end=" ")
    # return l