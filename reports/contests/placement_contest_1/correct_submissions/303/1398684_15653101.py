def nextGreaterElement(arr):
    res=[-1]*len(arr)
    stack=[]
    for i in range(len(arr)):
        while stack and (arr[stack[-1]]<arr[i]):
            p=stack.pop()
            res[p]=arr[i]
        stack.append(i)
    for i in res:
        print(i,end=' ')