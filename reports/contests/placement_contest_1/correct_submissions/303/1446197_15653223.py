def nextGreaterElement(arr):
    stack=[]
    length= len(arr)
    ans=[]
    for i in range(length-1,-1,-1):
        while(len(stack)!=0 and stack[-1]<=arr[i]):
            stack.pop(-1)
        if(len(stack)==0):
            ans.append(-1)
            stack.append(arr[i])
        else:
            ans.append(stack[-1])
            stack.append(arr[i])
    for i in ans[::-1]:
        print(i,end=" ")