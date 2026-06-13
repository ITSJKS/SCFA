def prevgreatest(arr):
    # ans = [0 for i in range(len(arr))]
    # for i in range(len(arr)):
    #     m = -1
    #     for j in range(i+1, len(arr)):
    #         m = max(m, arr[j])
    #     ans[i] = m 
    # return ans
    stack = []
    ans = []
    m = 0
    for i in range(len(arr)):
        while(stack):
            m = max(m, stack[-1])
            stack.pop()
        
        ans.append(m)
        stack.append(arr[i])
    return ans

def nextgreater(arr):
    # ans = [0 for i in range(len(arr))]
    # for i in range(len(arr)-1, -1, -1):
    #     m = -1
    #     for j in range(i-1, -1, -1):
    #         m = max(m, arr[j])
    #     ans[i] = m 
    # return ans
    m = 0
    stack = []
    ans = []
    for i in range(len(arr)-1, -1, -1):
        while(stack):
            m = max(m, stack[-1])
            stack.pop()
 
        ans.append(m)

        stack.append(arr[i])
    return ans[::-1]
def trap(arr):
    ps = prevgreatest(arr)
    ng = nextgreater(arr)
    ans = 0
    # print(ps)
    # print(ng)

    for i in range(len(arr)):
        m = min(ps[i], ng[i])
        if(m > 0):
            # print(f"{i}- {m-arr[i]}")
            if(m-arr[i] > 0):

                ans += m-arr[i]
    return ans